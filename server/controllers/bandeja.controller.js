const Bandeja = require('../models/bandeja');
const Usuario = require('../models/usuario');
const DetalleBandeja = require('../models/detalleBandeja');
const multer = require('multer');
var imager = require('multer-imager');
const uuid = require('uuid/v4');
const aws = require('aws-sdk');
const path = require('path');
let moment = require('moment-timezone');
const {
    clean,
    validate
} = require('rut.js')
module.exports = {
    getTrays: async (req, res) => {
        try {
            const bandejas = await Bandeja.find({})
                .populate('ubicacion')
                .populate('usuario', 'nombre apPat apMat rut')
            return res.send({
                success: true,
                bandejas
            });

        } catch (error) {
            return res.send({
                success: false,
                message: 'No existe información',
                error
            });
        }

    },
    deleteTray: async (req, res) => {
        let id = req.params.id;
        const s3 = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.REGION
        });
        try {
            bandejaDB = await Bandeja.findById(id)
            console.log(bandejaDB)
            if (!bandejaDB) {
                return res.send({
                    success: true,
                    message: "No se encontró el Id ingresado"
                });
            } else {
                let params = {
                    Bucket: process.env.AWS_Bucket,
                    Key: bandejaDB.idImg
                }
                s3.deleteObject(params, (error, imagen) => {
                    if (error) {
                        return res.send('no se borró la imagen')
                    } else {

                        Bandeja.findByIdAndDelete(bandejaDB._id, (err, bnd) => {
                            if (err) {
                                throw error
                            } else {
                                return res.send({
                                    success: true,
                                    message: "Bandeja eliminada con éxito"
                                });
                            }

                        })

                    }
                });
            }
        } catch (error) {
            return res.send({
                success: false,
                message: 'No existe información',
                error
            });
        }
    },
    getTraysByDate: async (req, res) => {
        let horaInicioDia = moment(req.params.fechaIngreso).startOf('day');
        let horaTerminoDia = moment(req.params.fechaIngreso).endOf('day');
        try {
            let bandejaDB = await Bandeja.find({
                    fechaIngreso: {
                        $gte: horaInicioDia,
                        $lte: horaTerminoDia
                    }

                })
                .populate('ubicacion')
                .populate('usuario', 'nombre apPat apMat rut')
            if (bandejaDB.length) {
                return res.send({
                    success: true,
                    bandejaDB
                });
            } else {
                return res.send({
                    success: true,
                    message: ' No existen bandejas ingresadas para el día seleccionado'
                });
            }

        } catch (error) {
            return res.send({
                success: false,
                message: 'No existe información',
                error
            });
        }


    },
    getCountByMonth: async (req, res) => {
        try {
            let cantidad = await Bandeja.aggregate([{
                    $group: {
                        _id: {
                            año: {
                                $year: "$fechaIngreso"
                            },
                            mes: {
                                $month: "$fechaIngreso"
                            }

                        },

                        total: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        "_id.año": 1,
                        "_id.mes": 1

                    }
                }
            ]);
            return res.send({
                success: true,
                cantidad
            })
        } catch (error) {
            return res.send({
                success: false,
                message: 'No existe información',
                error
            });

        }
    },
    getCountByYear: async (req, res) => {
        try {
            let cantidad = await Bandeja.aggregate([{
                    $group: {
                        _id: {
                            año: {
                                $year: "$fechaIngreso"
                            },
                        },
                        total: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        "_id.año": 1
                    }
                }
            ])
            return res.send({
                success: true,
                cantidad
            })
        } catch (error) {
            return res.send({
                success: false,
                message: 'No existe información',
                error
            })
        }
    },
    getCountByDay: async (req, res) => {
        try {
            let cantidad = await Bandeja.aggregate([{
                    $group: {
                        _id: {
                            año: {
                                $year: "$fechaIngreso"
                            },
                            mes: {
                                $month: "$fechaIngreso"
                            },
                            dia: {
                                $dayOfWeek: "$fechaIngreso"
                            }
                        },
                        total: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        "_id.año": 1,
                        "_id.mes": 1,
                        "_id.dia": 1

                    }
                }
            ])
            return res.send({
                success: true,
                cantidad
            });
        } catch {
            return res.send({
                success: false,
                message: 'No existe información',
                error
            });
        }
    },
    getTraysByUbications: (req, res) => {
        Bandeja.aggregate([{
            $group: {
                _id: {
                    ubicacion: "$ubicacion"
                },
                total: {
                    $sum: 1
                }
            }
        }], (err, cantidad) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'No existe información',
                    err
                });
            } else {
                Bandeja.populate(cantidad, {
                    path: '_id',
                    model: 'Ubicacion'
                }, function (err, ubicaciones) {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'No existe información',
                            err
                        });
                    } else {
                        return res.send({
                            success: true,
                            ubicaciones
                        });
                    }
                });
            }
        });
    },
    getTraysByUser: (req, res) => {
        let rutUsuario = req.params.rut
        Usuario.findOne({
                rut: clean(rutUsuario)
            })
            .exec()
            .then((usuario) => {
                Bandeja.find({
                        "usuario": usuario._id
                    })
                    .populate('ubicacion')
                    .populate('usuario', 'nombre apPat apMat rut')
                    .exec()
                    .then((bandejas) => {

                        if (bandejas.length == 0) {
                            return res.send({
                                success: false,
                                message: "El usuario no posee bandejas registradas",
                                err
                            });
                        } else {
                            return res.send({
                                success: true,
                                bandejas,
                                total: bandejas.length
                            })
                        }

                    })
                    .catch((err) => {
                        return res.send({
                            success: false,
                            message: "El usuario no posee bandejas registradas",
                            err
                        });
                    });

            })
            .catch((err) => {

                return res.send({
                    success: false,
                    message: "El usuario ingresado no existe ",
                    err
                });
            });

    },
    getTraysByType: (req, res) => {
        let tipoBandeja = req.params.tipo.toUpperCase();
        DetalleBandeja.find({
                tipo: tipoBandeja
            })
            .exec()
            .then((detalle) => {
                Bandeja.find({
                        "tipoDeBandeja": detalle._id
                    })
                    .populate('ubicacion')
                    .populate('usuario', 'nombre apPat apMat rut')
                    .exec()
                    .then((bandejas) => {

                        if (bandejas.length == 0) {
                            return res.send({
                                success: false,
                                message: "No existen bandejas registradas de ese tipo",
                                err
                            });
                        } else {
                            return res.send({
                                success: true,
                                bandejas,
                                total: bandejas.length
                            })
                        }

                    })
                    .catch((err) => {
                        return res.send({
                            success: false,
                            message: "No existen bandejas registradas de ese tipo",
                            err
                        });
                    });

            })
            .catch((err) => {

                return res.send({
                    success: false,
                    message: "El tipo de bandeja ingresado no existe ",
                    err
                });
            });

    },
    getTrayByQR: async (req, res) => {
        let qr = req.params.codigoQr;
        try {
            let bandejaDB = await Bandeja.find({
                    codigoQr: qr
                })
                .populate('ubicacion')
                .populate('usuario', 'nombre apPat apMat rut')
                .exec()
            if (!bandejaDB.length) {
                return res.send({
                    success: true,
                    message: "El código ingresado no existe ",
                });
            }
            return res.send({
                success: true,
                bandejaDB
            });

        } catch {
            return res.send({
                success: false,
                message: "El código no existe ",
                err
            });
        }

    },
    getTraysByDateRange: async (req, res) => {
        let fechaInicio = moment(req.params.inicio).startOf('day');
        let fechaTermino = moment(req.params.termino).endOf('day');
        try {
            if (fechaTermino < fechaInicio) {
                return res.send({
                    success: true,
                    message: 'La fecha de inicio  no puede ser mayor que la fecha de termino',
                });
            }
            let bandejaDB = await Bandeja.find({
                    fechaIngreso: {
                        $gte: fechaInicio,
                        $lte: fechaTermino
                    }
                })
                .populate('ubicacion')
                .populate('usuario', 'nombre apPat apMat rut')
                .exec()

            if (!bandejaDB.length) {
                return res.send({
                    success: true,
                    message: 'No existen bandejas para el rango de fechas ingresado ',
                });
            }

            return res.send({
                success: true,
                bandejaDB
            });


        } catch (error) {
            return res.send({
                success: false,
                message: 'Hubo un error ',
                error
            });
        }

    },
    getTraysByUserAndDateRange: (req, res) => {
        let rutUsuario = req.params.rut;
        let fechaInicio = moment(req.params.inicio).startOf('day');
        let fechaTermino = moment(req.params.termino).endOf('day');
        Usuario.findOne({
                rut: clean(rutUsuario)
            })
            .exec()
            .then((usuario) => {
                Bandeja.find({
                        "usuario": usuario._id,
                        fechaIngreso: {
                            $gte: fechaInicio,
                            $lte: fechaTermino
                        }
                    })
                    .populate('ubicacion')
                    .populate('usuario', 'nombre apPat apMat rut')
                    .exec()
                    .then((bandejas) => {

                        if (bandejas.length == 0) {
                            return res.send({
                                success: false,
                                message: "El usuario no posee bandejas registradas",
                                err
                            });
                        } else {
                            return res.send({
                                success: true,
                                bandejas,
                                total: bandejas.length
                            })
                        }

                    })
                    .catch((err) => {
                        return res.send({
                            success: false,
                            message: "El usuario no posee bandejas registradas",
                            err
                        });
                    });

            })
            .catch((err) => {

                return res.send({
                    success: false,
                    message: "El usuario ingresado no existe ",
                    err
                });
            });

    },
    getTray: async (req, res) => {
        let id = req.params.id;
        const s3 = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.REGION
        });
        try {
            bandejaDB = await Bandeja.findById(id)
                .populate('ubicacion')
                .populate('usuario', 'nombre apPat apMat rut')
            if (!bandejaDB) {
                return res.send({
                    success: true,
                    message: "No se encontró el Id ingresado"
                });
            } else {
                let link = s3.getSignedUrl('getObject', {
                    Bucket: process.env.AWS_Bucket,
                    Key: bandejaDB.idImg,
                    Expires: 600
                });

                bandejaDB.idImg = link;;
                return res.send({
                    success: true,
                    bandejaDB
                })
            }

        } catch (error) {
            return res.send({
                success: false,
                message: "No existe el ID ingresado",
            })
        }

    },
    createTray: (req, res) => {
        try {
            const uploadImage = multer({
                storage: imager({
                    dirname: process.env.dir,
                    bucket: process.env.Compress,
                    accessKeyId: process.env.AWS_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    region: process.env.REGION,
                    filename: function (req, file, cb) {
                        cb(null, uuid() + path.extname(file.originalname));
                    },
                    metadata: function (req, file, cb) {
                        cb(null, {
                            fieldName: file.fieldname
                        });
                    },
                    key: function (req, file, cb) {
                        cb(null, uuid() + path.extname(file.originalname));
                    },
                    gm: {
                        width: 2500,
                        height: 3500,
                        quality: 70,
                        crop: {
                            width: 2500,
                            height: 3500,
                            x: 0,
                            y: 0,

                        }
                    },
                }),
                limits: {
                    fileSize: 5000000
                },
                fileFilter: (req, file, cb) => {
                    const filetypes = /jpeg|jpg/;
                    const mimetype = filetypes.test(file.mimetype);
                    const extname = filetypes.test(path.extname(file.originalname)
                        .toLocaleLowerCase());
                    if (mimetype && extname) {
                        return cb(null, true);
                    } else if (extname !== '.jpg' && extname !== 'jpeg') {
                        return cb(new Error('Solo permitidas imagenes Jpg-Jpeg'));
                    } else if (file.fileSize > 5000000) {
                        return cb(new Error('Tamaño de archivo excede el máximo de 5Mb'));
                    }
                    cb("Imagen no valida");
                }
            }).single('image');
            uploadImage(req, res, (error) => {
                let body = req.body;
                if (req.file === undefined) {
                    return res.send({
                        success: false,
                        message: "No existe imagen",
                        error
                    });
                } else {
                    let img = req.file.key.split('/');
                    let trayType = body.codigoQr.search(/[a-zA-Z]/);
                    if (trayType === -1) {
                        return res.send({
                            success: false,
                            message: "No existe un tipo de bandeja ingresado",
                            error
                        });
                    } else {
                        DetalleBandeja.findOne({
                                tipo: body.codigoQr[trayType]
                            })
                            .exec((error, bandejaEncontrada) => {
                                if (error) {
                                    throw error;
                                } else {
                                    let fecha = new Date(body.fecha)
                                    let localId = body.localId
                                    let bandeja = new Bandeja({
                                        fechaIngreso: moment(fecha).utc({
                                            keepLocalTime: true
                                        }),

                                        idImg: `${img[1]}`,
                                        codigoQr: body.codigoQr,
                                        ubicacion: body.ubicacion,
                                        usuario: body.usuario,
                                        tipoDeBandeja: bandejaEncontrada._id,

                                    });
                                    bandeja.save((error, bndj) => {

                                        if (error) {
                                            throw error
                                        } else {
                                            return res.send({
                                                success: true,
                                                message: "Imagen subida exitosamente ",
                                                localId
                                            });
                                        }
                                    })
                                }
                            });

                    }
                }
            });
        } catch (error) {
            return res.send({
                success: false,
                message: "Imposible cargar la imagen",
                error
            });
        }

    },

};