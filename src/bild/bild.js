const { isNull } = require("lodash");

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
    RichText,
    InspectorControls,
    MediaUpload,
    MediaReplaceFlow,
    MediaUploadCheck,
    BlockControls
} = wp.blockEditor;
const { 
    PanelBody,
    IconButton,
    TextareaControl,
    SelectControl
} = wp.components;
const { Fragment } = wp.element;

// Functions
const calcHeight = ( image ) => {

    if(!image) return '0';

    const { height, width } = image;

    const title = document.querySelector('.wp-block.editor-post-title__block');

    const ratio = height / width;
    const max_width = title.clientWidth;
    const img_height = max_width * ratio;

    return img_height + 'px';
}

// Constants
const imgClass = 'image';
const spacingOptions = [
    { value: 'no', label: 'Inget' },
    { value: 'small', label: 'Liten' },
    { value: 'medium', label: 'Mellan' },
    { value: 'large', label: 'Stor' },
]

const defaultSpacingTop = { 
    value: 'large',
    label: 'stor'
}

const defaultSpacingBottom = { 
    value: 'large',
    label: 'stor'
}

const logo = (
    <svg xmlns="http://www.w3.org/2000/svg" id="Lager_1" data-name="Lager 1" viewBox="0 0 187.67 99.16">
        <title>Rityta 1</title>
        <path class="cls-1" style={ {fill: '#1d1d1b'} } d="M127,64.92h21.84l4.53,13H164L142.46,21.09h-9.1L111.91,78H122.5Zm10.9-31.48L146,56.76H129.84Z"/>
            <rect class="cls-1" x="43.91" y="21.21" width="10.08" height="56.88"/>
        <path class="cls-1" d="M98.23.37H-.33V98.93H187.23V.37Zm79,88.56H98.67V78.09H88.23V88.93H9.67V10.37H88.23V21.21H98.67V10.37h78.56Z"/>
    </svg>
)

registerBlockType('ia/block-bild', {

	title: __( 'Bild' ),
	icon: logo,
	category: 'ia-blocks',

    // Custom attributes
    attributes: {
        image: {
            type: 'object',
            default: null
        },
        caption: {
            type: 'string',
            default: null
        },
        spacingTop: {
            type: 'string',
            default: defaultSpacingTop['value']
        },
        spacingBottom: {
            type: 'string',
            default: defaultSpacingBottom['value']
        }
    },

	edit: ( props ) => {
        const { attributes, setAttributes } = props;

        const {
            image,
            caption,
            spacingTop,
            spacingBottom
        } = attributes;

        const url = (isNull(image) ? '' : image['url']);

        const imgStyle = {
            backgroundImage: `url(${url})`,
            backgroundPosition: 'center', 
            backgroundSize: 'cover',
            height: calcHeight( image ),
            width: '100%'
        };

        const captionStyle = {
            padding: '20px',
            fontStyle: 'italic',
            fontWeight: 'lighter',
            margin: image ? '8px 0 0 0' : '13px 0 0 0',
            textAlign: 'center'
        };

        const btnStyle = {
            textAlign: 'center',
            display: 'inline-block',
            backgroundColor: '#f5f5f5',
            padding: '50px 0',
            width: '100%'
        }

        const onCaptionChange = caption => {
            setAttributes( { caption } );
        };

        const onTopOptionsChange = value => {
            setAttributes( { spacingTop: value } );
        }

        const onBottomOptionsChange = value => {
            setAttributes( { spacingBottom: value } );
        }

        const onSelectImg = image => {
            const {
                caption,
            } = image;

            setAttributes({
                image,
                caption,
            });
        };

		return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title='Bildinställningar'>
                        <p><strong>Din bildtext</strong></p>
                        <TextareaControl value={ caption } onChange={ onCaptionChange }/>
                    </PanelBody>
                    <PanelBody title='Marginaler'>
                        <p><strong>Välj ett avstånd för överdelen</strong></p>
                        <SelectControl value={ spacingTop } options={ spacingOptions } onChange={ onTopOptionsChange }/>
                        <p><strong>Välj ett avstånd för underdelen</strong></p>
                        <SelectControl value={ spacingBottom } options={ spacingOptions } onChange={ onBottomOptionsChange }/>
                    </PanelBody>
                </InspectorControls>
                { isNull(image) ?

                <div style={ btnStyle }>
                    <MediaUploadCheck>
                        <MediaUpload type="image" onSelect={ onSelectImg } value={ image } render={ ( { open } ) => { return(
                                <IconButton style={ { border: '#555d66 1px solid' } } onClick={ open } icon="upload">
                                    Ladda upp en bild
                                </IconButton>
                            )
                        } }/>
                    </MediaUploadCheck>
                </div>

                :

                <div style={ imgStyle }>
                    <BlockControls>
                        <MediaReplaceFlow 
                        onSelect={ onSelectImg } onFilesUpload={ images => {} } 
                        mediaURL={ url } allowedTypes={ ['image'] }
                        accept={ ['image/jpeg', 'image/png', 'image/gif'] } onSelectURL={ url => {} } 
                        />
                    </BlockControls>
                </div>

                }
                <RichText 
                    key="editable" style={ captionStyle } tagName="p" placeholder="Skriv en bildtext" 
                    keepPlaceholderOnFocus={ true } value={ caption } onChange={ onCaptionChange }
                />
			</Fragment>
		);
	},

	save: ( props ) => {
        const { attributes } = props;

        const {
            image,
            caption,
            spacingTop,
            spacingBottom
        } = attributes;

        const {
            url = "",
            height,
            width
        } = image;

        const imgStyle = {
            backgroundImage: `url(${url})`,
            backgroundPosition: 'center', 
            backgroundSize: 'cover'
        };

        const classes = `IA image-outer ${spacingTop}-top ${spacingBottom}-bottom`;

        return (
            <div className={ classes }>
                <div className="IA image" data-width={ width } data-height={ height } style={ imgStyle }></div>    
                { caption
                ? <RichText.Content className="caption" tagName="p" value={ caption } /> 
                : '' 
                }
            </div>
        );
	},
});
