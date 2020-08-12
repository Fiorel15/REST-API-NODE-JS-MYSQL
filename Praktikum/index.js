// memasukkan library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const md5 = require("md5")
const moment = require("moment")
const { error } = require("console")
const { response } = require("express")
const { errorMonitor } = require("stream")

// memanggil library
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// membuat Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "penyewaan_mobil"
})

// Check database connection
db.connect(error => {
    if (error){
        console.log(error.message)
    }else{
        console.log("MySQL Connected")
    }
})

//Server port 8000 connection
app.listen(8000,() =>{
    console.log("Run on port 8000")
})


// CRUD MOBIL
// end-point tampil data mobil keseluruhan
app.get("/mobil", (req,res) => {
    let sql = "select * from mobil"

    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        }else {
            response = {
                count: result.length, // jumlah data
                mobil: result // isi data
            }
        }
        res.json(response)
    })
})

// end-point tampil data mobil berdasarkan id_mobil
app.get("/mobil/:id", (req, res) => {
    let data = {
        id_mobil: req.params.id
    }
    // create sql query
    let sql = "select * from mobil where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            response = {
                count: result.length, // jumlah data
                mobil: result // isi data
            }            
        }
        res.json(response) // send response
    })
})

// end-point INSERT data mobil 
app.post("/mobil", (req,res) => {

    // data
    let data = {
        id_mobil:req.body.id_mobil,
        nomor_mobil: req.body.nomor_mobil,
        merk: req.body.merk,
        jenis: req.body.jenis,
        warna: req.body.warna,
        tahun_pembuatan: req.body.tahun_pembuatan,
        biaya_sewa_per_hari: req.body.biaya_sewa_per_hari,
        image: req.body.image
    }

    // create sql query insert
    let sql = "insert into mobil set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response)
    })
})

// end-point UPDATE data mobil
app.put("/mobil", (req, res) => {

    // Array untuk menyimpan data baru dan primary key
    let data = [
        // data baru
        {
            nomor_mobil: req.body.nomor_mobil,
            merk: req.body.merk,
            jenis: req.body.jenis,
            warna: req.body.warna,
            tahun_pembuatan: req.body.tahun_pembuatan,
            biaya_sewa_per_hari: req.body.biaya_sewa_per_hari,
            image: req.body.image
        },

        // primary key
        {
            id_mobil: req.body.id_mobil
        }
    ]

    let sql = "update mobil set ? where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null 
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
}) 

// end-point DELETE data mobil
app.delete("/mobil/:id", (req,res) => {
    // prepare data
    let data = {
        id_mobil: req.params.id
    }

    let sql = "delete from mobil where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})


//CRUD KARYAWAN
// end-point akses data Karyawan KESELURUHAN
app.get("/karyawan", (req,res) => {
    let sql = "select * from karyawan"
    
    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        }else {
            response = {
                count: result.length, // jumlah data
                karyawan: result // isi data
            }
        }
        res.json(response)
    })
})

// end-point akses data Karyawan berdasarkan id_karyawan tertentu
app.get("/karyawan/:id", (req, res) => {
    let data = {
        id_karyawan: req.params.id
    }
    // create sql query
    let sql = "select * from karyawan where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            response = {
                count: result.length, // jumlah data
                karyawan: result // isi data
            }            
        }
        res.json(response) // send response
    })
})

// end-point INSERT data Karyawan 
app.post("/karyawan", (req,res) => {

    // data
    let data = {
        id_karyawan: req.body.id_karyawan,
        nama_karyawan: req.body.nama_karyawan,
        alamat_karyawan: req.body.alamat_karyawan,
        kontak: req.body.kontak,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // create sql query insert
    let sql = "insert into karyawan set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response)
    })
})

// end-point UPDATE data Karyawan
app.put("/karyawan", (req, res) => {

    // Array untuk menyimpan data baru dan primary key
    let data = [
        // data baru
        {
            id_karyawan: req.body.id_karyawan,
            nama_karyawan: req.body.nama_karyawan,
            alamat_karyawan: req.body.alamat_karyawan,
            kontak: req.body.kontak,
            username: req.body.username,
            password: md5(req.body.password)
        },

        // primary key
        {
            id_karyawan: req.body.id_karyawan
        }
    ]

    let sql = "update karyawan set ? where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null 
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
}) 

// end-point DELETE data Karyawan
app.delete("/karyawan/:id", (req,res) => {
    // prepare data
    let data = {
        id_karyawan: req.params.id
    }

    let sql = "delete from karyawan where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})


// CRUD PELANGGAN
// end-point menampilkan semua data pelanggan
app.get("/pelanggan", (req,res) => {
    let sql = "select * from pelanggan"

    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                pelanggan: result
            }
        }
        res.json(response)
    })
})

// end-point menampilkan data Pelanggan menggunakan id
app.get("/pelanggan/:id", (req,res) => {
    let data = {
        id_pelanggan: req.params.id
    }

    let sql = "select * from pelanggan where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }  
        } else {
            response = {
                count: result.length,
                pelanggan: result
            }
        }
        res.json(response)
    })
})

// end-point INSERT data pelanggan
app.post("/pelanggan",(req,res)=>{
    let data = {
        id_pelanggan: req.body.id_pelanggan,
        nama_pelanggan: req.body.nama_pelanggan,
        alamat_pelanggan: req.body.alamat_pelanggan,
        kontak: req.body.kontak
    }

    let sql = "insert into pelanggan set ?"

    db.query(sql, data, (error,result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response)
    })
})

// end-point UPDATE data Pelanggan
app.put("/pelanggan", (req,res) => {
    let data = [
        {
            id_pelanggan: req.body.id_pelanggan,
            nama_pelanggan: req.body.nama_pelanggan,
            alamat_pelanggan: req.body.alamat_pelanggan,
            kontak: req.body.kontak
        },

        {
            id_pelanggan: req.body.id_pelanggan
        }
    ]

    let sql = "update pelanggan set ? where ?"

    db.query(sql, data, (error, result) => {
        let response = null 
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
}) 

// end-point DELETE data Pelanggan 
app.delete("/pelanggan/:id", (req,res) => {
    let data = {
        id_pelanggan: req.params.id
    }

    let sql = "delete from pelanggan where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})



// REST API Proses Transaksi
//  Menambahkan Data Sewa Mobil
app.post("/sewa_mobil", (req,res) => {
    let data = {
        id_sewa : req.body.id_sewa,
        id_mobil : req.body.id_mobil,
        id_karyawan : req.body.id_karyawan,
        id_pelanggan : req.body.id_pelanggan,
        tgl_sewa: moment().format('YYYY-MM-DD HH:mm:ss'),
        tgl_kembali : req.body.tgl_kembali,
        total_bayar : req.body.total_bayar
    }

    let sql = "INSERT into sewa set ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
                }
            } else {
                response = {
                    message: result.affectedRows + " data inserted"
                }
            }
            res.json(response)
    })
})

// Menampilkan Data Sewa Mobil
app.get("/sewa_mobil", (req,res) => {
    let sql = "SELECT * FROM sewa"

    db.query(sql, (error,result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                sewa: result
            }
        }
        res.json(response)
    })
})

// end-point menampilkan data sewa 
app.get("/detail_sewa", (req,res) => {

     let sql = "SELECT m.merk, m.biaya_sewa_per_hari, m.nomor_mobil, m.jenis, m.warna, m.tahun_pembuatan, m.image, k.nama_karyawan, p.nama_pelanggan, s.tgl_sewa, s.tgl_kembali, s.total_bayar " +
                "FROM sewa s JOIN mobil m ON s.id_mobil = m.id_mobil " + 
                "JOIN karyawan k ON s.id_karyawan = k.id_karyawan " +
                "JOIN pelanggan p ON s.id_pelanggan = p.id_pelanggan"

    db.query(sql, (error,result) => {
        if(error) {
             res.json({message: error.message})
        } else {
            res.json({
                count : result.length,
                sewa: result
            })
        }
    })
})

// Menampilkan Detail Sewa berdasarkan id_pelanggan
app.get("/sewa_mobil/:id", (req,res) => {
    let data = {
        id_pelanggan: req.params.id
    }

    let sql ="SELECT p.id_pelanggan, s.id_sewa, p.nama_pelanggan, m.id_mobil, m.nomor_mobil, m.merk, k.id_karyawan, k.nama_karyawan " +
    "FROM sewa s JOIN pelanggan p ON s.id_pelanggan = p.id_pelanggan " +
    "JOIN mobil m ON s.id_mobil = m.id_mobil " +
    "JOIN karyawan k ON s.id_karyawan = k.id_karyawan WHERE p.? "

    db.query(sql, data, (error,result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                data: result
            }
        }
        res.json(response)
    })
})

// end-point Menghapus Data Sewa
app.delete("/sewa_mobil/:id", (req,res) => {
    let param = { id_sewa: req.params.id}

    let sql = "DELETE FROM sewa WHERE ?"

    db.query(sql, param, (error, result) => {
            if(error) {
                res.json({message: error.message})
          } else {
                res.json({message: "Data has been deleted"})
        }
    })
})

               
