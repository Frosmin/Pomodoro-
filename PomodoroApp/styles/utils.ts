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

    d_flex:{
        display: "flex",
    },
    flex_column: {
        flexDirection: "column",
    },
    flex_row: {
        flexDirection: "row",
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



    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 20,
    },
})

export default util_styles



    