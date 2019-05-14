const React = require('react');
const {ViewPropTypes} = ReactNative = require('react-native');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
import LinearGradient from 'react-native-linear-gradient';

const {
    View,
    Animated,
    StyleSheet,
    ScrollView,
    Text,
    Platform,
    Dimensions,
    ImageBackground, TouchableWithoutFeedback, Image
} = ReactNative;
const Button = require('./Button');

const WINDOW_WIDTH = Dimensions.get('window').width;

const ScrollableTabBar = createReactClass({
    propTypes: {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
        backgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        scrollOffset: PropTypes.number,
        style: ViewPropTypes.style,
        tabStyle: ViewPropTypes.style,
        tabsContainerStyle: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        renderTab: PropTypes.func,
        underlineStyle: ViewPropTypes.style,
        onScroll: PropTypes.func,
    },

    getDefaultProps() {
        return {
            scrollOffset: 52,
            activeTextColor: 'navy',
            inactiveTextColor: 'black',
            backgroundColor: null,
            style: {},
            tabStyle: {},
            tabsContainerStyle: {},
            underlineStyle: {},
        };
    },

    getInitialState() {
        this._tabsMeasurements = [];
        return {
            _leftTabUnderline: new Animated.Value(0),
            _widthTabUnderline: new Animated.Value(0),
            _containerWidth: null,
        };
    },

    componentDidMount() {
        this.props.scrollValue.addListener(this.updateView);
    },

    updateView(offset) {
        const position = Math.floor(offset.value);
        const pageOffset = offset.value % 1;
        const tabCount = this.props.tabs.length;
        const lastTabPosition = tabCount - 1;

        if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
            return;
        }

        if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
            this.updateTabPanel(position, pageOffset);
            this.updateTabUnderline(position, pageOffset, tabCount);
        }
    },

    necessarilyMeasurementsCompleted(position, isLastTab) {
        return this._tabsMeasurements[position] &&
            (isLastTab || this._tabsMeasurements[position + 1]) &&
            this._tabContainerMeasurements &&
            this._containerMeasurements;
    },

    updateTabPanel(position, pageOffset) {

        if(this.props.dataLength - 1 !== position){
            position +=1
        }


        const containerWidth = this._containerMeasurements.width;
        const tabWidth = this._tabsMeasurements[position].width;
        const nextTabMeasurements = this._tabsMeasurements[position + 1];
        const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
        const tabOffset = this._tabsMeasurements[position].left;

        const absolutePageOffset = pageOffset * tabWidth;
        let newScrollX = tabOffset + absolutePageOffset;

        // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
        newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
        newScrollX = newScrollX >= 0 ? newScrollX : 0;

        if (Platform.OS === 'android') {
            this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false,});
        } else {
            const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
            newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
            this._scrollView.scrollTo({x: newScrollX - (position === 0 ? 0 : 8), y: 0, animated: false,});
        }

    },

    updateTabUnderline(position, pageOffset, tabCount) {
        const lineLeft = this._tabsMeasurements[position].left;
        const lineRight = this._tabsMeasurements[position].right;

        if (position < tabCount - 1) {
            const nextTabLeft = this._tabsMeasurements[position + 1].left;
            const nextTabRight = this._tabsMeasurements[position + 1].right;

            const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
            const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

            this.state._leftTabUnderline.setValue(newLineLeft +51);
           // this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
            this.state._widthTabUnderline.setValue(30);
        } else {
            this.state._leftTabUnderline.setValue(lineLeft + 51);
            //this.state._widthTabUnderline.setValue(lineRight - lineLeft);
            this.state._widthTabUnderline.setValue(30);
        }
    },

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
        const {activeTextColor, inactiveTextColor, textStyle,} = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';

        const CATE_IMAGE_Width = (WINDOW_WIDTH / 3);

        const category = JSON.parse(name)

        return (

            <TouchableWithoutFeedback
                key={`${category.category_name}_${page}`}
                accessible={true}
                accessibilityLabel={category.category_name}
                accessibilityTraits='button'
                onPress={() => onPressHandler(page)}
                onLayout={onLayoutHandler}
                hitSlop={{top: 50, left: 10, bottom: 10, right: 10}}>

                <View style={{
                    //marginLeft: page === 0 ? 10 : 0,
                    width: CATE_IMAGE_Width - 8,
                    overflow: "hidden",
                    //backgroundColor: "red",
                    borderRadius: 10, alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "column"
                }}>
                    <Image style={{
                        height: "100%",
                        width: "95%",
                        borderRadius: 10
                    }}
                                     //imageStyle={{borderRadius: 10,}}
                           source={{uri: "https://www.staplesadvantage.co.uk/fileadmin/san/opcos/eu/images/solutions/sustainable_environment/vendors/diversey_sure/sure_square_small.jpg"}}
                    />
                    <View style={{
                        width: '95%',
                        bottom: 5,
                        position: 'absolute',
                        zIndex: 100,alignItems: "center",
                    }}>
                        <Text style={{
                            color: "white",
                            fontWeight: "800",
                            textAlign: "center",
                        }} numberOfLines={1}>{category.category_name}</Text>
                       {/* {isTabActive &&
                        <View style={{width:"30%",backgroundColor:"white",height:3}}/>
                        }*/}
                    </View>

                    <LinearGradient colors={["transparent", '#535354',]}
                                    style={{
                                        height: 20,
                                        width: '95%',
                                        alignItems: 'center',
                                        position: 'absolute',
                                        bottom: 0,
                                        borderBottomLeftRadius: 10,borderBottomRightRadius: 10
                                    }}/>
                    {/*<Text>{category.category_name}</Text>*/}
                    {/* <ImageBackground
                        source={{uri: "https://www.staplesadvantage.co.uk/fileadmin/san/opcos/eu/images/solutions/sustainable_environment/vendors/diversey_sure/sure_square_small.jpg"}}
                        style={{
                            flex:1,
                            height: null,
                            width: "95%",
                            alignItems: "center",justifyContent:"center"
                        }}
                        imageStyle={{borderRadius: 10,}}
                    >
                    </ImageBackground>*/}
                    {/* <ImageBackground
                        source={{uri: "https://www.staplesadvantage.co.uk/fileadmin/san/opcos/eu/images/solutions/sustainable_environment/vendors/diversey_sure/sure_square_small.jpg"}}
                        style={{
                            height: "100%",// this.props.cateImageHeight,
                            width: "95%",
                        }}
                        imageStyle={{borderRadius: 10,}}
                    >
                        <View style={{alignItems: "center", justifyItems: "flex-end", flexDirection: "column",bottom:10, height: "100%",}}>
                            <Text style={{
                                color: "white",
                                fontWeight: "800",
                                textAlign: "center",
                                zIndex: 100,
                            }}>{category.category_name}</Text>
                        </View>
                    </ImageBackground>*/}

                </View>


            </TouchableWithoutFeedback>


        )
    },

    measureTab(page, event) {
        const {x, width, height,} = event.nativeEvent.layout;
        this._tabsMeasurements[page] = {left: x, right: x + width, width, height,};
        this.updateView({value: this.props.scrollValue.__getValue(),});
    },

    render() {
        const tabUnderlineStyle = {
            position: 'absolute',
            height: 2,
            backgroundColor: 'white',
            bottom: 0,

        };

        const dynamicTabUnderline = {
            left: this.state._leftTabUnderline,
            width: this.state._widthTabUnderline,
            position:"absolute",bottom:13,alignItems:"center"
        };

        return <Animated.View
            style={[styles.container, {
                backgroundColor: this.props.backgroundColor,
                height: this.props.cateImageViewHeight,
            }, this.props.style,]}
            onLayout={this.onContainerLayout}
        >
            <ScrollView
                ref={(scrollView) => {
                    this._scrollView = scrollView;
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                directionalLockEnabled={true}
                bounces={false}
                scrollsToTop={false}
            >
                <View
                    style={[styles.tabs, {
                        width: this.state._containerWidth,
                        paddingTop: 10, paddingBottom: 10,
                    }, this.props.tabsContainerStyle,]}
                    ref={'tabContainer'}
                    onLayout={this.onTabContainerLayout}
                >
                    {this.props.tabs.map((name, page) => {
                        const isTabActive = this.props.activeTab === page;
                        const renderTab = this.props.renderTab || this.renderTab;
                        return renderTab(name, page, isTabActive, this.props.goToPage, this.measureTab.bind(this, page));
                    })}
                    <Animated.View style={[tabUnderlineStyle, dynamicTabUnderline, this.props.underlineStyle, ]} />
                </View>
            </ScrollView>
        </Animated.View>;
    },

    componentWillReceiveProps(nextProps) {
        // If the tabs change, force the width of the tabs container to be recalculated
        if (JSON.stringify(this.props.tabs) !== JSON.stringify(nextProps.tabs) && this.state._containerWidth) {
            this.setState({_containerWidth: null,});
        }
    },

    onTabContainerLayout(e) {
        this._tabContainerMeasurements = e.nativeEvent.layout;
        let width = this._tabContainerMeasurements.width;
        if (width < WINDOW_WIDTH) {
            width = WINDOW_WIDTH;
        }
        this.setState({_containerWidth: width,});
        this.updateView({value: this.props.scrollValue.__getValue(),});
    },

    onContainerLayout(e) {
        this._containerMeasurements = e.nativeEvent.layout;
        this.updateView({value: this.props.scrollValue.__getValue(),});
    },
});

module.exports = ScrollableTabBar;

const styles = StyleSheet.create({
    tab: {
        height: 49,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    container: {
        //height: 50,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#ccc',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
