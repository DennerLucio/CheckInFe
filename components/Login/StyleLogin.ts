import {StyleSheet } from 'react-native'


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3B73BD',
      width: '100%'
     
    },
    containerTitulo:{
      width:'100%',
      height:'50%',
      alignItems:'center',
      justifyContent:'center',
      gap:10,
      flexDirection: 'row'

    },
 
    areaTitulo: {
      height: '65%',
      backgroundColor: '#3B73BD',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    scrollViewContent: {
      flexGrow: 1, // Faz o ScrollView ocupar o espaço completo
      justifyContent: 'center', // Centraliza o conteúdo
    },
    containerImg:{
      width:'100%',
      height:'50%',
    },
    imgPray:{
      width:200,
      height: 200,
      position:'absolute',
      right:10,
      bottom:-25,
     
      // marginLeft:'100%',
      // marginTop:'100%',
      // transform: [
      //   { translateX: -100 }, // Mover a imagem -100 unidades no eixo X
      //   { translateY: -100 }, // Mover a imagem 50 unidades no eixo Y
      // ],
    },
    title: {
      color:'#FFF',
      fontSize: 42,
      fontWeight: '300',
    },
    titleSub:{
      color:'#FFF',
      fontSize: 42,
      fontWeight: 'bold',
    },
    areaLogin:{
      flex: 1,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',

    },
    inputEmail: {
      marginTop:20,
      width: '70%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
      borderRadius: 7,
    },
    inputSenha: {

      width: '70%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
      borderRadius: 7,
    },
    button: {
      width: '70%',
      height: 40,
      backgroundColor: '#007bff',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 7,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
  });

  export default styles;