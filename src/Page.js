import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from  '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { createTheme, ThemeProvider } from '@mui/material/styles';

var datamhs;
let kodejurusan;
let kodefakultas;
var listfakultas;
var listjurusan;
let kodejurusanreversed;
let kodefakultasreversed;
var listjurusanreversed;

function swap(json) {
    var ret = {};
    for (let key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

function swaplowercase(json) {
    var ret = {};
    for (let key in json) {
        ret[json[key].toLowerCase()] = key;
    }
    return ret;
}

async function getData() {
    // READ THE JSON FILE TO THE GLOBAL VARIABLES 
    
    const res = await fetch('./json/data_13_21.json');
    const data = await res.json();
    datamhs = data;
    for (var i = 0; i < datamhs.length; i++) {
        if (datamhs[i].length === 2) {
            datamhs[i].push("TPB") // HANDLE YANG NIM NYA CUMAN 2 AJA
        }
    }
    
    const res2 = await fetch('./json/kode_fakultas.json');
    const data2 = await res2.json();
    kodefakultas = data2;

    const res3 = await fetch('./json/kode_jurusan.json');
    const data3 = await res3.json();
    kodejurusan = data3;
    
    const res4 = await fetch('./json/list_fakultas.json');
    const data4 = await res4.json();
    listfakultas = data4;
    
    const res5 = await fetch('./json/list_jurusan.json');
    const data5 = await res5.json();
    listjurusan = data5;
    
    kodejurusanreversed = swap(kodejurusan);
    kodefakultasreversed = swap(kodefakultas);
    listjurusanreversed = swaplowercase(listjurusan)
}


async function cariMHS(input) {

    let boolnama, booljurusan, boolfakultas, boolnim, booltahun, namajurusan, namafakultas, singkatanjurusan, singkatanfakultas;
    let teksArray, nama = [],
    nim = "",
    jurusan = "",
    fakultas = "",
    tahun = ""
    let databener = []

    let keyslistjur = Object.keys(listjurusanreversed);
    for (let k = keyslistjur.length - 1; k >= 0; k--) {
        if (regexContain(input.toLowerCase(), keyslistjur[k].toLowerCase())) {
            jurusan = keyslistjur[k].toLowerCase()
            input = input.replace(keyslistjur[k], "")
        }
    }
    
    teksArray = input.split(" ");
    teksArray = teksArray.filter(e => e !== "");
    for (let k = 0; k < teksArray.length; k++) {
        if (/^[0-9]+$/.test(teksArray[k])) { // KALAU NUMBER, KEMUNGKINAN TAHUN ATAU NIM
            if ((jurusan !== "" || fakultas !== "") && teksArray[k].length === 2) {
                tahun = teksArray[k] // MASUKIN KE TAHUN
            } else {
                nim = teksArray[k]; // MASUKKIN KE NIM
            }
        } else { // SISANYA KEMUNGKINAN NAMA / JURUSAN / FAKULTAS
            if (Object.keys(kodefakultas).includes(teksArray[k].toUpperCase())) {
                fakultas = teksArray[k].toUpperCase();
            } else if (Object.keys(kodejurusan).includes(teksArray[k].toUpperCase()) || Object.keys(listjurusanreversed).includes(teksArray[k])) {
                jurusan = teksArray[k];
            } else {
                nama.push(teksArray[k]);
            }
        }
    }
    
    // CONVERT ARRAY OF NAMA TO STRING OF NAMA
    let stringnama = "";
    for (let k = 0; k < nama.length; k++) {
        if (stringnama !== "") {
            stringnama += " ";
        }
        stringnama += nama[k];
        nama[k] = nama[k].toLowerCase(); // sekalian ubah lowercase karena not case sensitive
    }

    for (var i = 0; i < datamhs.length; i++) {

        // KAMUS
        boolnama = false;
        boolnim = false;
        booljurusan = false;
        boolfakultas = false;
        booltahun = false;
        
        // THE CONDITIONALS
        if (stringnama !== "") {
            if (regexContain(datamhs[i][0].toLowerCase(), stringnama.toLowerCase()) || nama.every(e => datamhs[i][0].toLowerCase().split(" ").includes(e))) {
                boolnama = true;
            }
        } else {
            boolnama = true;
        }
        if (nim !== "") {
            if (regexContain(datamhs[i][1], nim) || regexContain(datamhs[i][2], nim)) {
                boolnim = true;
            }
        } else {
            boolnim = true;
        }
        
        if (fakultas === "") {
            boolfakultas = true;
        } else {
            if (datamhs[i][1].substring(0, 3) === kodefakultas[fakultas]) { // INI UNTUK NGEHANDLE KASUS KODEFAKULTAS[""]
                boolfakultas = true;
            }
        }
        if (jurusan === "") {
            booljurusan = true;
        } else {
            if (datamhs[i][2] !== "TPB") { // UNTUK HANDLE KASUS GAPUNYA NIM JURUSAN
                if (jurusan.length < 4) {
                    if (datamhs[i][2].substring(0, 3) === kodejurusan[jurusan.toUpperCase()]) { // INI UNTUK NGEHANDLE KASUS KODEFAKULTAS[""]
                        booljurusan = true;
                    }
                } else {
                    if (datamhs[i][2].substring(0, 3) === listjurusanreversed[jurusan]) { // INI UNTUK NGEHANDLE KASUS KODEFAKULTAS[""]
                        booljurusan = true;
                    }
                }
            }
            
        }
        if (tahun === "" || datamhs[i][1].substring(3, 5) === tahun) {
            booltahun = true;
        }
        
        // CONVERT NIM TO FAKULTAS/JURUSAN
        namafakultas = listfakultas[datamhs[i][1].substring(0, 3)];
        if (datamhs[i][2] === "TPB") {
            namajurusan = "-"
            singkatanjurusan = ""
            
        } else {
            namajurusan = listjurusan[datamhs[i][2].substring(0, 3)];
            singkatanjurusan = kodejurusanreversed[datamhs[i][2].substring(0, 3)];
        }
        
        singkatanfakultas = kodefakultasreversed[datamhs[i][1].substring(0, 3)];

        // CHECK AND PRINT THE DATA
        if (boolnama && booljurusan && boolnim && boolfakultas && booltahun) {
            databener.push([datamhs[i][0], datamhs[i][1], datamhs[i][2], namafakultas, singkatanfakultas, namajurusan, singkatanjurusan])
        }
    }
    console.log(databener)
    return databener
}

function regexContain(text, pattern) { // USING REGEX TO CHECK IF A PATTERN EXIST IN STRING
    return new RegExp(pattern).test(text)
}

const theme = createTheme({
  palette: {

    primary: {
      main: '#BC9928',

    },
    secondary: {
      main: '#0000ff',
      contrastText: '#00ff00',
    },
    background: {
      default: "#242424"
    },
    mode: 'dark',
  },
});

class Page extends Component{
    constructor(props){
        super(props)
        this.state = {
            data: [],
            searched: false
        }
    }
    
    componentDidMount(){
        getData();
    }
    
    render() {

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (event.target.query.value.length < 3){
            alert("Minimal panjang query adalah 3!")
            return
        }
        this.setState({
            data: await cariMHS(event.target.query.value),
            searched: true,
          });
    }

    const handleChange = async (event) => {
        event.preventDefault();
        if (event.target.value.length >= 3){
            this.setState({
                data: await cariMHS(event.target.value),
                searched: true,
              });
        }
    }

      return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Paper elevation = {6}  sx={{width: '50%', margin: '10px auto', padding: '50px', mt:8}}>
                <Typography component="h1" variant="h4" sx={{marginBottom: '20px', fontWeight: '700', textShadow: '1px 1px 9px gold', textAlign: 'center'}}>
                    Sayerz NIM-Finder
                </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TextField
                    margin="normal"
                    fullWidth
                    onChange = {handleChange}
                    id="query"
                    placeholder='Dapat memasukkan NIM, nama, fakultas, ataupun jurusan!'
                    name="query"
                    autoFocus
                    sx = {{color: 'red', width: '100%', mr: 2}}
                    />
                    <IconButton type ="submit" color="primary" aria-label="search person" sx={{height:'1o0%', outline:1}}>
                        <PersonSearchIcon  fontSize='medium' sx={{strokeWidth: 1}} />
                    </IconButton>
              </Box>
            </Paper>

    {this.state.searched && <Typography sx={{ width: '75%', margin: '0 auto', mt: 5 }} >Showing {this.state.data.length} results... </Typography>}
    <TableContainer component={Paper} sx={{ width: '75%', margin: '0 auto', mt: 5 }}>
      <Table aria-label="simple table">
        <TableHead>
        {this.state.data.length>0 && 
          <TableRow>
            <TableCell align="center">Nama</TableCell>
            <TableCell align="center">NIM</TableCell>
            <TableCell align="center">Fakultas | Jurusan</TableCell>
          </TableRow>
          }
        </TableHead>
        <TableBody>

        {this.state.data.map((row) => (
            // KEY GAPAKE NAMA KARENA DITEMUKAN ADA NAMA YANG PERSIS! PAKE NIM AJA
            <TableRow key= {row[1]}> 
              <TableCell align="center">{row[0]}</TableCell>
              <TableCell align="center">{row[1]} <br></br> {row[2]}</TableCell>
              <TableCell align="center">{row[4]} <br></br> {row[6]}</TableCell>
            </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
        </ThemeProvider>
      )
    }
  }
  
export default Page;