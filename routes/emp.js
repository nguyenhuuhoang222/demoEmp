var express = require("express");
var router = express.Router();
const Emp = require("../models/emp.models");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const employees = await Emp.find({role: "user"}); // Fetch employees from the database
    res.render("emp/index", { employees });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/search", async (req, res, next) => {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).send('Keyword is required.');
      }
  
      const employees = await Emp.find({
        role: "user",
        name: { $regex: keyword, $options: 'i' } // Case-insensitive search
      });
  
      res.render("emp/index", { employees });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

router.get("/create", async (req, res) => {
  return res.render("emp/create");
});

router.post('/create', async (req, res) => {
    try {
        const emp = await Emp.create(req.body); // Tạo mới Employee
        return res.redirect('/emp'); // Redirect về trang index
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating employee');
    }
});


router.get("/login", async (req, res) => {
  return res.render("emp/login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, pwd } = req.body;
    const emp = await Emp.findOne({ email,pwd });

    if (!emp || emp.pwd !== pwd) {
      return res.status(400).send("Invalid email or password");
    }

    if (emp.role === "admin") {
      return res.redirect("/emp");
    } else {
      return res.render("emp/details", { emp });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/delete/:id", async (req, res) => {
try{
  const {id} = req.params.id;
  await Emp.findByIdAndDelete(id);
  return res.redirect("/emp");
}
catch(err){
  console.error(err);
  return res.status(500).send("Internal Server Error");

}
});

router.post

router.get("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Emp.findById(id);

    if (!emp) {
      return res.status(404).send("Employee not found");
    }
    return res.render("emp/update", { emp });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});




router.post("/update/:id", async (req, res) => {
  try {
    // Lấy tham số từ URL
    const { id } = req.params;

    // Lấy dữ liệu từ model
    const emp = await Emp.findById(id);
    if (!emp) {
      return res.status(404).send("Employee not found");
    }

    // Lấy dữ liệu từ req.body
    const { name, email, phone } = req.body;

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!name || !email || !phone) {
      return res.status(400).send("All fields (name, email, phone) are required");
    }

    // Cập nhật dữ liệu
    emp.name = name;
    emp.email = email;
    emp.phone = phone;

    // Lưu lại dữ liệu
    await emp.save();
    console.log(emp);
    return res.redirect("/emp");
  } catch (err) {
    console.error("Error updating employee:", err.message);
    return res.status(500).send("Server error");
  }
});


module.exports = router;
