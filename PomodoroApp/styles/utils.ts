import { StyleSheet } from "react-native"
import { colors } from "./colors"

const header_family = "sans-serif"
const body_family = "Times New Roman"



const util_styles = StyleSheet.create({
  // Text 
  h1:{
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: header_family,
   },

   h2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: header_family,
   },

   h3: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: header_family,
   },

   h4: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: header_family,
   },

   p: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: body_family,
   },

   //text-colors
   t_white: {
    color: colors.white,
   },

    //buttons

    btn : {
      padding: 10,
      borderRadius: 5,
    },
    btn_dark : {
        backgroundColor: colors.black,
    },
    btn_secondary : {
        backgroundColor: colors.neutral_100,
    },


    //displays

    flex_column: {
        flexDirection: "column",
    },
    flex_row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
    },

    //spacing

    m_1: {
        margin: 5,
    },
    m_2: {
        margin: 10,
    },
    m_3: {
        margin: 15,
    },
    m_4: {
        margin: 20,
    },
    m_5: {
        margin: 25,
    },
    mb_1: {
        marginBottom: 5,
    },
    mb_2: {
        marginBottom: 10,
    },
    mb_3: {
        marginBottom: 15,
    },
    mb_4: {
        marginBottom: 20,
    },
    mb_5: {
        marginBottom: 25,
    },
    mt_1: {
        marginTop: 5,
    },
    mt_2: {
        marginTop: 10,
    },
    mt_3: {
        marginTop: 15,
    },
    mt_4: {
        marginTop: 20,
    },
    mt_5: {
        marginTop: 25,
    },
    me_1: {
        marginEnd: 5,
    },
    me_2: {
        marginEnd: 10,
    },
    me_3: {
        marginEnd: 15,
    },
    me_4: {
        marginEnd: 20,
    },
    me_5: {
        marginEnd: 25,
    },
    ms_1: {
        marginStart: 5,
    },
    ms_2: {
        marginStart: 10,
    },
    ms_3: {
        marginStart: 15,
    },
    ms_4: {
        marginStart: 20,
    },
    ms_5: {
        marginStart: 25,
    },
    g_1: {
        gap: 5,
    },
    g_2: {
        gap: 10,
    },
    g_3: {
        gap: 15,
    },
    g_4: {
        gap: 20,
    },
    g_5: {
        gap: 25,
    },
    p_1: {
        padding: 5,
    },
    p_2: {
        padding: 10,
    },
    p_3: {
        padding: 15,
    },
    p_4: {
        padding: 20,
    },
    p_5: {
        padding: 25,
    },


    //others

    hide: {
      height: 0,
      overflow: "hidden",
      padding: 0,
      margin: 0,
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 20,
    },
})

export default util_styles



    