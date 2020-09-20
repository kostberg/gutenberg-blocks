/* eslint-disable no-console */
/* eslint-disable indent */

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
    RichText,
    InspectorControls,
    ColorPalette
} = wp.blockEditor;
const { 
    PanelBody,
    SelectControl
} = wp.components;
const { Fragment } = wp.element;

// Constants
const spacingOptions = [
    { value: 'no', label: 'Inget' },
    { value: 'small', label: 'Liten' },
    { value: 'medium', label: 'Mellan' },
    { value: 'large', label: 'Stor' },
]

const defaultSpacingTop = { 
    value: 'no',
    label: 'stor'
}

const defaultSpacingBottom = { 
    value: 'no',
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

registerBlockType( 'ia/block-bildtext', {

	title: 'Bildtext',
	icon: logo,
	category: 'ia-blocks',

    // Custom attributes
    attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: 'p.caption',
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
            content,
            spacingTop,
            spacingBottom
        } = attributes;

        const bildtextStyle = {
            fontStyle: 'italic',
            fontWeight: 'lighter',
            padding: '0 20px'
        };

        const onChangeBildtext = text => {
            setAttributes( { content: text } );
        };

        const onTopOptionsChange = value => {
            setAttributes( { spacingTop: value } );
        }

        const onBottomOptionsChange = value => {
            setAttributes( { spacingBottom: value } );
        }

		return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title='Marginaler'>
                            <p><strong>Välj ett avstånd för överdelen</strong></p>
                            <SelectControl value={ spacingTop } options={ spacingOptions } onChange={ onTopOptionsChange }/>
                            <p><strong>Välj ett avstånd för underdelen</strong></p>
                            <SelectControl value={ spacingBottom } options={ spacingOptions } onChange={ onBottomOptionsChange }/>
                    </PanelBody>
                </InspectorControls>
                <RichText key="editable" style={ bildtextStyle } tagName="h4" placeholder="Din bildtext" keepPlaceholderOnFocus={ true } value={ content } onChange={ onChangeBildtext } />
			</Fragment>
		);
	},

	save: ( props ) => {
        const { attributes } = props;

        const {
            content,
            spacingTop,
            spacingBottom
        } = attributes;

        const bildtextStyle = {
            fontStyle: 'italic',
            fontWeight: 'lighter'
        };

        const classes = `caption-outer ${spacingTop}-top ${spacingBottom}-bottom`;

        return (
            <div className={ classes }>
                <RichText.Content style={ bildtextStyle } className="caption" tagName="p" value={ content } />
            </div>
        );
	},
} );
