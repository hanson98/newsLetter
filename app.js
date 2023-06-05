import express from "express";
import https from "https";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us9.api.mailchimp.com/3.0/lists/2babdbfce6/members";
  const options = {
    method: "post",
    auth: "hanson1:e2d190adb381cf55cb41ae14dca59d4c-us9",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
