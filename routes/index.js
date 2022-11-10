var express = require("express");
const Mongodb = require("mongodb");
const cors = require("cors");
const { hashPassword, hashCompare } = require("../bin/auth");
var router = express.Router();
const JWT = require("jsonwebtoken");
const env = require("dotenv").config();

const MongoClient = Mongodb.MongoClient;
const client = new MongoClient(process.env.DB_URL);

router.use(
  cors({
    origin: "*",
  })
);

let authentication = async (req, res, next) => {
  try {
    let check = JWT.verify(req.headers.authorization, process.env.SECRET_KEY);
    if (check) {
      next();
    }
  } catch (error) {
    res.json({
      statusCode: 400,
      message: "Unauthorized please login",
    });
  }
};

router.get("/account",authentication, async (req, res) => {
  await client.connect();

  try {
    const db = await client.db(process.env.DB_NAME);
    if (db) {
      let users = await db
        .collection(process.env.DB_COLLECTION_ONE)
        .find()
        .toArray();
      res.json({
        statusCode: 200,
        users,
      });
    }else{
      res.json({
        statusCode: 200,
        message: 'Invalid response',
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: "Internal server error",
      error: error,
    });
  } 
  finally {
    client.close();
  }
});

router.get("/users",authentication, async (req, res) => {
  await client.connect();

  try {
    const db = await client.db(process.env.DB_NAME);
    if (db) {
      let users = await db
        .collection(process.env.DB_COLLECTION_ONE)
        .find()
        .toArray();
      res.json({
        statusCode: 200,
        users,
      });
    }else{
      res.json({
        statusCode: 200,
        message: 'Invalid response',
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: "Internal server error",
      error: error,
    });
  } 
  finally {
    client.close();
  }
});
// router.get("/suggestion",authentication, async (req, res) => {
//   await client.connect();

//   try {
//     const db = await client.db(process.env.DB_NAME);
//     if (db) {
//       let users = await db
//         .collection(process.env.DB_COLLECTION_ONE)
//         .find()
//         .toArray();
//       res.json({
//         statusCode: 200,
//         users,
//       });
//     }else{
//       res.json({
//         statusCode: 200,
//         message: 'Invalid response',
//       });
//     }
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: "Internal server error",
//       error: error,
//     });
//   } 
//   finally {
//     client.close();
//   }
// });

router.get("/items",authentication, async (req, res) => {
  await client.connect();

  try {
    const db = await client.db(process.env.DB_NAME);
    let items = await db
        .collection(process.env.DB_COLLECTION_TWO)
        .find()
        .toArray();
    if (items) {
      res.json({
        statusCode: 200,
        items,
      });
    }
    else{
      res.json({
        statusCode: 404,
        message: 'Invalid response',
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: "Internal server error",
      error: error,
    });
  } 
  finally {
    client.close();
  }
});

// router.get("/story", async (req, res) => {
//   await client.connect();
//   try {
//     const db = await client.db(process.env.DB_NAME);
   
//     if (db) {
//       let users = await db
//         .collection(process.env.DB_COLLECTION_THREE)
//         .find()
//         .toArray();
//         if (users) {
//       res.json({
//         statusCode: 200,
//         users,
//       });
//     }else{
//      ({ statusCode: 404,
//       message: "Internal credentials",
//       })
//     }}
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: "Internal server error",
//       error: error,
//     });
//   } 
//   finally {
//     client.close();
//   }
// });

router.post("/post",authentication, async (req, res) => {
  console.log(req.body);
  await client.connect();
  try {
    const db = await client.db(process.env.DB_NAME);
    
      let users = await db
        .collection(process.env.DB_COLLECTION_TWO)
        .insertOne(req.body);
      if (users) {
        res.json({
          statusCode: 200,
          message: "Uploaded successfully ",
        });
      } else {
        res.json({
          statusCode: 404,
          message: "Uploaded failed",
        });
      }
  } catch {
    res.json({
      statusCode: 500,
      message: "Internal server error",
    });
  } 
  finally {
    client.close();
  }
});
router.post("/saved",authentication, async (req, res) => {
  console.log(req.body);
  await client.connect();
  try {
    const db = await client.db(process.env.DB_NAME);
    
      let users = await db
        .collection(process.env.DB_COLLECTION_FOUR)
        .insertOne(req.body);
      if (users) {
        res.json({
          statusCode: 200,
          message: "Uploaded successfully ",
        });
      } else {
        res.json({
          statusCode: 404,
          message: "Uploaded failed",
        });
      }
  } catch {
    res.json({
      statusCode: 500,
      message: "Internal server error",
    });
  } 
  finally {
    client.close();
  }
});



router.post("/comments/:id",authentication, async (req, res) => {
  console.log(req.body);
  await client.connect();
  try {
    const db = await client.db(process.env.DB_NAME);
    let Comment = {
      text:req.body,
      postedBy:req.headers.uniqueId,
    }
    let users = await db.collection(process.env.DB_COLLECTION_TWO).updateOne(
      { _id: Mongodb.ObjectId(req.params.id) },
      {
        $push: {
          Comments: Comment,
        },
      },{
        new: true,
      }
    );
    if (users) {
      res.json({
        statusCode: 200,
        message: "Uploaded successfully ",
      });
    } else {
      res.json({
        statusCode: 404,
        message: "Uploaded failed",
      });
    }
  } catch {
    res.json({
      statusCode: 500,
      message: "Internal server error",
    });
  } 
  finally {
    client.close();
  }
});


router.post("/likes/:id",authentication, async (req, res) => {
  console.log(req.params.id);
  await client.connect();
  try {
    const db = await client.db(process.env.DB_NAME);
    let like = {
      likedBy:req.headers.uniqueId,
    }
    let users = await db.collection(process.env.DB_COLLECTION_TWO).updateOne(
      { _id: Mongodb.ObjectId(req.params.id) },
      {
        $push: {
          Likes: like,
        },
      },{
        new: true,
      }
    );
    if (users) {
      res.json({
        statusCode: 200,
        message: "Uploaded successfully ",
      });
    } else {
      res.json({
        statusCode: 404,
        message: "Uploaded failed",
      });
    }
  } catch {
    res.json({
      statusCode: 500,
      message: "Internal server error",
    });
  } 
  finally {
    client.close();
  }
});



router.post("/sign-up", async (req, res) => {
  await client.connect();
  try {
    const db = await client.db(process.env.DB_NAME);
    let user = await db
      .collection(process.env.DB_COLLECTION_ONE)
      .find({ email: req.body.email })
      .toArray();
    if (user.length === 0) {
      req.body.password = await hashPassword(req.body.password);
      let users = await db
        .collection(process.env.DB_COLLECTION_ONE)
        .insertOne(req.body);
      if (users) {
        res.json({
          statusCode: 200,
          message: "Signup successful",
        });
      }
    } else {
      res.json({
        statusCode: 401,
        message: "User was already exist Please Log in!",
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: "Internal server error",
    });
  } 
  finally {
    client.close();
  }
});

router.post("/login", async (req, res) => {
  await client.connect();
  try {
    const db = await client.db(process.env.DB_NAME);
    let user = await db
      .collection(process.env.DB_COLLECTION_ONE)
      .find({ email: req.body.email })
      .toArray();
    if (user.length === 1) {
      let hashResult = await hashCompare(req.body.password, user[0].password);

      if (hashResult) {
        let token = JWT.sign({ email: user[0].email }, process.env.SECRET_KEY, {
          expiresIn: "15m",
        });
        
        res.json({
          statusCode: 200,
          message: "Login successful",
          token,
          user,
        });
      } else {
        res.json({
          statusCode: 401,
          message: "Invalid details",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "User does not exist Please Sign up",
      });
    }
  } catch {
    res.json({
      statusCode: 500,
      message: "Internal server error",
    });
  } 
  finally {
    client.close();
  }
});

module.exports = router;
// router.get("/mentor", authentication, async (req, res) => {
//   await client.connect();

//   try {
//     const db = client.db(DbName);
//     let users = await db.collection("users").find({role:"mentor"}).toArray();
//     console.log(users);
//     res.json({
//       statusCode: 200,
//       users,
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: "internal error occurred",
//       error: error,
//     });
//   } finally {
//     client.close();
//   }
// });
// router.get("/student", authentication, async (req, res) => {
//   await client.connect();
//   try {
//     const db = client.db(DbName);
//     let users = await db.collection("users").find({subject:req.headers.mentors}).toArray();
//     res.json({
//       statusCode: 200,
//       users,
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: "internal error occurred",
//       error: error,
//     });
//   } finally {
//     client.close();
//   }
// });

// router.get("/user/:id", authentication, async (req, res) => {
//   await client.connect();
//   try {
//     const db = await client.db(DbName);
//     let users = await db
//       .collection("users")
//       .find({ _id: Mongodb.ObjectId(req.params.id) })
//       .toArray();

//     res.json({
//       statusCode: 200,
//       users,
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: "internal error occurred",
//       error: error,
//     });
//   } finally {
//     client.close();
//   }
// });

// router.put("/reset/:id", authentication, async (req, res) => {
//   await client.connect();

//   try {
//     const db = await client.db(DbName);
//     let data = await db
//       .collection("users")
//       .find({ _id: Mongodb.ObjectId(req.params.id) })
//       .toArray();

//     if (data[0].email === req.body.email) {
//       if (req.body.password) {
//         req.body.password = await hashPassword(req.body.password);

//         let users = await db
//           .collection("users")
//           .updateOne(
//             { _id: Mongodb.ObjectId(req.params.id) },
//             { $set: req.body }
//           );

//         res.json({
//           statusCode: 200,
//           message: "Do you have change the Details?",
//           users,
//         });
//       } else {
//         res.json({
//           statusCode: 400,
//           message: "credentials does not match (: ",
//         });
//       }
//     } else {
//       res.json({
//         statusCode: 401,
//         message: "invalid details email does not change",
//       });
//     }
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: "internal error occurred",
//       error: error,
//     });
//   } finally {
//     client.close();
//   }
// });

// router.post("/forgot", async (req, res) => {
//   await client.connect();
//   try {
//     const db = await client.db(DbName);

//     let user = await db
//       .collection("users")
//       .find({ email: req.body.email })
//       .toArray();
//     if (user.length === 1) {
//       if (req.body.password === req.body.confirm_password) {

//           let hashpassword = await hashPassword(req.body.password);

//           if (hashpassword) {
//             let users = await db
//               .collection("users")
//               .updateOne(
//                 { email: req.body.email },
//                 { $set: { password: hashpassword } }
//               );
//             if (users) {
//               let token = JWT.sign({ email: user.email }, process.env.SECRET_KEY, {
//                 expiresIn: "5m",
//               });
//               let hashed = req.body.email
//               res.json({
//                 statusCode: 200,
//                 message: "Password changed successfully",
//                 token,
//                 hashed,
//               });
//             }
//           } else {
//             res.json({
//               statusCode: 401,
//               message: "incorrect Details ^_^",
//             });
//           }

//       } else {
//         res.json({
//           statusCode: 403,
//           message: "details does not match",
//         });
//       }
//     } else {
//       res.json({
//         statusCode: 400,
//         message: "user does not exist Please DO Register -->",
//       });
//     }
//   } catch {
//     res.json({
//       statusCode: 500,
//       message: "internal server error",
//     });
//   } finally {
//     client.close();
//   }
// });

// router.delete("/delete-user/:id", authentication, async (req, res) => {
//   await client.connect();
//   try {
//     const db = await client.db(DbName);
//     let data = await db
//       .collection("users")
//       .deleteOne({ _id: Mongodb.ObjectId(req.params.id) });
//       if (data) {
//         let users = await db.collection("users").find().toArray();

//     res.json({
//       statusCode: 200,
//       message: "Are you sure delete this user?",
//     });}
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: "internal server error",
//     });
//   } finally {
//     client.close();
//   }
// });
