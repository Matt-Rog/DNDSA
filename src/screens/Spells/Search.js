import {
    StyleSheet,
    SafeAreaView,
    Text,
    TextInput,
    FlatList,
    Pressable,
    Dimensions,
    View,
    Image,
    Modal,
    ScrollView
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MOCKDATA from "../../../MOCK_SPELL_DATA.json"
// Utility
import AppStyles from '../../utils/AppStyles';
import * as FILTER from '../../utils/FilterHelper'
import FilterComponents from '../../utils/FilterComponents';
// Components
import FilterList from '../../components/Filters/FilterList';
import ModalSearch from '../../components/ModalSearch'
import SpellList from '../../components/SpellList';
import EmptySplash from '../../components/EmptySplash';


import {COLORS} from '../../utils/Colors'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function SearchPage({navigation, route}) {

    const onResultPress = () => {
      navigation.navigate("Spell")
    }

    const onFilterPress = () => {
      navigation.navigate("Filter Spells")
    }



    const [allSpells, setAllSpells] = useState(MOCKDATA)
    const [filterSpells, setFilterSpells] = useState(MOCKDATA)
    const [filter, setFilter] = useState({})
    const [isInitial, setIsInitial] = useState(true)
    const [resultSpells, setResultSpells] = useState(MOCKDATA)
    const [search, setSearch] = useState("")
    const [isHidden, setIsHidden] = useState(true)

    useEffect(() => {
      // write your code here, it's like componentWillMount
      console.log("Search loaded")
      if(isInitial){
        setFilter({})
        updateFilter({})
        setIsInitial(false)
      }
      if(route.params?.INITDATA){
        console.log("PASSED")
        if(route.params.INITDATA.length>0){
          setResultSpells(route.params.INITDATA)
          setFilterSpells(route.params.INITDATA)
        } else {
          if(route.params?.RESET && route.params.RESET==true){
            setResultSpells(allSpells)
            setFilterSpells(allSpells)
          } else {
            setResultSpells(route.params.INITDATA)
            setFilterSpells(route.params.INITDATA)
            setIsHidden(false)
          }
        }
      }
      setIsHidden(true)
      // if(route.params?.FILTER){
      //   console.log("FILTER")
      //   if(route.params.FILTER.length>0){
      //     setFilter(route.params.FILTER)
      //   } else {
      //     if(route.params?.RESET && route.params.RESET==true){
      //       setFilter({})
      //       console.log("RESET2")
      //     } else {
      //       setFilter(route.params.FILTER)
      //     }
      //   }
      // }
    }, [route.params?.INITDATA, route.params?.FILTER, route.params?.RESET])


    // useEffect(() => {
    //   const filterData = navigation.addListener('focus', () => {
    //     let data = FILTER.getFilter()
    //     setFilter(data)
    //   })
    //   return filterData;
    // }, [navigation]);

    // // const getFilter = async () => {
    // //   try {
    // //     const stringValue = await AsyncStorage.getItem('filter')
    // //     const jsonValue = JSON.parse(stringValue)
    // //     if (!jsonValue || typeof jsonValue !== 'object') {
    // //       return
    // //     }
    // //     console.log(">>>>>>> FILTER FROM PULL DATA")
    // //     console.log(jsonValue)
    // //     setFilter(jsonValue)
        
      
    // //   } catch(e) {
    // //     console.log("Error getting filter data")
    // //     console.log(e)
    // //   }
    // // }

    // // const updateData = async (value) => {
    // //   try {
    // //     const jsonValue = JSON.stringify(value)
    // //     await AsyncStorage.setItem('filter', jsonValue)
    // //     console.log("Filter Updated")
    // //     setFilter(value)
    // //   } catch (e) {I
    // //     console.log("Error updating characters")
    // //     console.log(e)
    // //   }
    // // }

    useEffect(() => {
      const loadData = navigation.addListener('focus', () => {
        getFilter()
      })
      return loadData;
    }, [navigation]);

    const getFilter = async () => {
      try {
        const stringValue = await AsyncStorage.getItem('filter')
        const jsonValue = JSON.parse(stringValue)
        if (!jsonValue || typeof jsonValue !== 'object') return
        setFilter(jsonValue)
        console.log("FILTER FROM GET DATA")
        console.log(jsonValue)
      
      } catch(e) {
        console.log("Error getting filter data")
        console.log(e)
      }
    }

    const updateFilter = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('filter', jsonValue)
        console.log()
        setFilter(value)
      } catch (e) {I
        console.log("Error updating filters")
        console.log(e)
      }
    }

    const getSpellIDs = (spellList) => {
      var spellIDs = []
      for(const spell of spellList){
        spellIDs.push(spell.ID);
      }
      
      return spellIDs;
    }

    const searchSpells = (text) => {
      if (text) {
        const newData = filterSpells.filter(function(item) {
          return (item.name.toUpperCase().startsWith(text.toUpperCase()))
        })
        if(newData.length==0){
          setIsHidden(false)
        } else {
          setIsHidden(true)
        }
        setResultSpells(newData)
        setSearch(text)
      } else {
        setResultSpells(filterSpells)
        setSearch(text);
        setIsHidden(true)
      }
    }

    function onBarIconPress(){
      if(search != ""){
        searchSpells("")
      }
    }


    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalComponent, setModalComponent] = useState()

    const changeModalVisibility = (bool) => {
      setIsModalVisible(bool)
    }

    function onModalPress(item){
      setModalComponent(item)
      changeModalVisibility(true)
    }

    function setFilterProp(params){
      var newFilter = FILTER.setProperty(filter, params)
      updateFilter(newFilter)
      setFilter(newFilter)
      // console.log("SET FILTER")
      // console.log(params.name)
      // console.log(params.selected)
      // setFilter((filter) => ({ 
      //   ...filter,
      //   [params.name]: params.selected
      // }))
    }

    return (
        <SafeAreaView style={AppStyles.Background}> 
          <Text style={styles.title}>Search Spells</Text>
          <View style={styles.searchBox}>
            <View style={styles.searchBar}>
              <TextInput 
                style={styles.input}
                placeholder="Search"
                value={search}
                selectionColor="#CCD2E3"
                placeholderTextColor="#CCD2E3"
                onChangeText={(text)=> searchSpells(text)}
              >
              </TextInput>
              <Pressable
                onPress={() => onBarIconPress()}
                style={styles.searchIcon}>
                  <FontAwesome
                  name={((search==="") ? "search" : "times")}
                  size={20}
                  color={"#CCD2E3"}
                  />
              </Pressable>
            </View>
            <Pressable
            onPress={onFilterPress}
            style={styles.filterIcon}>
              <FontAwesome5
              name={"sliders-h"}
              size={20}
              color={Object.keys(filter).length === 0 ? COLORS.secondary_content : COLORS.primary_accent}
              />
            </Pressable>
          </View>


          {/* Filter Horizontal Row */}
          <View style={styles.filterBox}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={FilterComponents({filter: filter, setFilterProp: (params) => setFilterProp(params)})}
              renderItem={({item}) => {
                return (
                  <Pressable
                    onPress={() => onModalPress(item)}
                    style={({pressed}) => [{backgroundColor: pressed? '#565C6B' : '#373C48'}, (filter[item.name] ? styles.activeButton : styles.button)]}
                >
                  <Text style={[styles.option, {color: (filter[item.name] ? COLORS.primary_content : COLORS.secondary_content)}]}>{item.name}</Text>
                </Pressable>
                )
              }}
              >
              </FlatList>
          </View>

          <Modal
            transparent={true}
            animationType='fade'
            visible={isModalVisible}
            style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
            nRequestClose={() => changeModalVisibility(false)}>
              <ModalSearch
                changeModalVisibility={changeModalVisibility}
                childComponent={modalComponent}
              >
              </ModalSearch>
          </Modal>


          <View style={styles.searchBox}>
              <Text style={styles.spellTXT}>{resultSpells.length!=0 ? resultSpells.length + " results" : ""}</Text>
          </View>
          <EmptySplash
            hide={isHidden}>
          </EmptySplash>
          <SpellList
            onResultPress={onResultPress}
            spellIDs = {getSpellIDs(resultSpells)}
            navigation={navigation}
            prevScreen="Search Spells"
            scrollEnabled={true}>
          </SpellList>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    base: {
      backgroundColor: "#181D23",
      height: '100%',
      width: "100%"
    },
    title: {
      color: "#FFFFFF",
      fontSize: 30,
      
      padding: 10,
      fontWeight: "bold"
    },
    resultContainer: {
    },
    searchBox: {
      marginBottom: 8,
      marginTop: 8,
      marginLeft: 30,
      marginRight: 30,
      borderRadius: 12,
      flexDirection:'row',
      justifyContent: 'space-between',
      alignItems: "center",
    },
    filterBox: {
      marginLeft: 30,
      marginRight: 30,
      borderRadius: 12,
      flexDirection:'row',
      justifyContent: 'space-between',
      alignItems: "center",
    },
    spellTXT: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "bold"
    },
    schoolTXT:{
      color: "#CCD2E3",
      fontSize: 14,
    },
    input:{
      borderWidth: 1,
      backgroundColor: "#373C48",
      borderColor: "#373C48",
      color: "#CCD2E3",
      borderRadius: 12,
      fontSize: 15,
      paddingLeft: 17,
      width: "80%",
      height: 40
    },
    searchBar:{
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      backgroundColor: "#373C48",
      borderColor: "#373C48",
      borderRadius: 12,
      fontSize: 15,
      width: "85%",
      height: 40,
      justifyContent: "space-between"
    },
    searchIcon: {
      marginRight: 15
    },
    filterIcon: {
      backgroundColor: COLORS.back,
      padding: 10,
      borderRadius: 12
    },
    option: {
      fontSize: 15,
      fontWeight: "bold",
      marginLeft: 13,
      marginRight: 13,
    },
    button: {
      borderRadius: 50,
      padding: 7,
      marginRight: 8,
      marginBottom: 3,
      marginTop: 3
    },
    activeButton: {
      backgroundColor: COLORS.primary_accent,
      borderRadius: 50,
      padding: 7,
      marginRight: 8,
      marginBottom: 3,
      marginTop: 3
    },
  });
