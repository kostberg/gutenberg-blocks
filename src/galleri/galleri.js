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

// Constants
const galleriGap = 30;
const logo = (
    <svg xmlns="http://www.w3.org/2000/svg" id="Lager_1" data-name="Lager 1" viewBox="0 0 187.67 99.16">
        <title>Rityta 1</title>
        <path class="cls-1" style={ {fill: '#1d1d1b'} } d="M127,64.92h21.84l4.53,13H164L142.46,21.09h-9.1L111.91,78H122.5Zm10.9-31.48L146,56.76H129.84Z"/>
            <rect class="cls-1" x="43.91" y="21.21" width="10.08" height="56.88"/>
        <path class="cls-1" d="M98.23.37H-.33V98.93H187.23V.37Zm79,88.56H98.67V78.09H88.23V88.93H9.67V10.37H88.23V21.21H98.67V10.37h78.56Z"/>
    </svg>
)
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

// Functions
const calcHeight = ( height, width, single ) => {
    const max_width = (single ? document.querySelector('.wp-block.editor-post-title__block').clientWidth : 250);

    const ratio = height / width;
    const img_height = max_width * ratio;

    return img_height + 'px';
}

registerBlockType('ia/block-galleri', {
	title: __( 'Galleri' ),
	icon: logo,
	category: 'ia-blocks',

    // Custom attributes
    attributes: {
        images: {
            type: 'array',
            default: []
        },
        caption: {
            type: 'string',
            default: null
        },
        description: 'Ett galleri för dina bilder',
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
            images,
            caption,
            spacingTop,
            spacingBottom
        } = attributes;

        const captionStyle = {
            padding: '20px',
            fontStyle: 'italic',
            fontWeight: 'lighter',
            margin: '13px 0 0 0',
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

        const onUploadImgs = newImages => {
            setAttributes({ images: [
                ...images, ...newImages
            ]});
        };

        const getImageElems = images => {
            const columns = getColumns(images);

            const galleriStyle = {
                display: 'grid',
                rowGap: `${galleriGap}px`
            }

            return (
                <div class="IA gallery-outer" style={ galleriStyle }>
                    { columns }
                </div>
            )
        }

        const getColumns = images => {
            columns = [];
            step = 2;

            for (var i=0; i<images.length; i+=step) {
                columns.push(images.slice(i,i+step));
            }

            const columnsElems = columns.map(column => {
                const size = column[0]['sizes']['full'];
                const height = size['height'];
                const width = size['width'];
                const single = (column.length < 2);
                console.log(size, height);

                const divHeight = calcHeight(height, width, single);

                const columnStyle = {
                    display: 'grid',
                    gridTemplateColumns: (column.length == 1 ? 'fr' : '1fr 1fr'),
                    columnGap: `${galleriGap}px`,
                    height: divHeight
                }

                const images = column.map((image, i) => getImage(image));
                
                return (
                    <div className="IA gallery-column" style={ columnStyle }>
                        { images }
                    </div>
                )
            })

            return (
                <Fragment>
                    { columnsElems }
                </Fragment>
            )
        }

        const getImage = image => {
            const {
                url,
            } = image;

            const imgStyle = {
                backgroundImage: `url(${url})`,
                backgroundPosition: 'center', 
                backgroundSize: 'cover',
                height: '100%',
                width: '100%'
            };

            return (
                <div style={ imgStyle }></div>
            )
        }

		return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title='Galleriinställningar'>
                        <p><strong>Din galleritext</strong></p>
                        <TextareaControl value={ caption } onChange={ onCaptionChange }/>
                    </PanelBody>
                    <PanelBody title='Marginaler'>
                        <p><strong>Välj ett avstånd för överdelen</strong></p>
                        <SelectControl value={ spacingTop } options={ spacingOptions } onChange={ onTopOptionsChange }/>
                        <p><strong>Välj ett avstånd för underdelen</strong></p>
                        <SelectControl value={ spacingBottom } options={ spacingOptions } onChange={ onBottomOptionsChange }/>
                    </PanelBody>
                </InspectorControls>

                { images.length > 0 ? 
                
                getImageElems(images)
            
                :

                <div style={ btnStyle }>
                    <MediaUploadCheck>
                        <MediaUpload type="image" onSelect={ onUploadImgs } multiple={ true }  gallery={ true } value={ images[0] } render={ ( { open } ) => { return(
                                <IconButton style={ { border: '#555d66 1px solid' } } onClick={ open } icon="upload">
                                    Ladda upp några bilder
                                </IconButton>
                            )
                        } }/>
                    </MediaUploadCheck>
                </div>
                }

                <RichText 
                    key="editable" style={ captionStyle } tagName="p" placeholder="Skriv en galleritext" 
                    keepPlaceholderOnFocus={ true } value={ caption } onChange={ onCaptionChange }
                />
			</Fragment>
		);
	},

	save: ( props ) => {
        const { attributes } = props;

        const {
            images,
            caption,
            spacingTop,
            spacingBottom
        } = attributes;

        const getImageElems = images => {
            const columns = getColumns(images);
            return (
                <div class="IA gallery">
                    { columns }
                </div>
            )
        }

        const getColumns = images => {
            columns = [];
            step = 2;

            for (var i=0; i<images.length; i+=step) {
                columns.push(images.slice(i,i+step));
            }

            return columns.map(column => {
                const columnStyle = {
                    display: 'grid',
                    gridTemplateColumns: (column.length == 1 ? 'fr' : '1fr 1fr')
                }

                const sizes = column[0]['sizes']['full'];
                const width = sizes['width'];
                const height = sizes['height'];

                const images = column.map((image, i) => getImage(image));

                return (
                    <div className="IA gallery-column" data-height={ height } data-width={ width } style={ columnStyle }>
                        { images }
                    </div>
                )
            })
        }

        const getImage = image => {
            const {
                url
            } = image;

            const imgStyle = {
                backgroundImage: `url(${url})`,
                backgroundPosition: 'center', 
                backgroundSize: 'cover'
            };

            return (
                <div style={ imgStyle }></div>
            )
        }

        const classes = `IA gallery-outer ${spacingTop}-top ${spacingBottom}-bottom`;

        return (
            <div className={ classes }>
                { getImageElems(images) }
                { caption
                ? <RichText.Content className="caption" tagName="p" value={ caption } /> 
                : ''
                }
            </div>
        );
	},
});
