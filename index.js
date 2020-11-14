const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");

const Validator = require("./validator/validator");

const app = express();
const PORT = 3000;

app.use(session({
    secret: "bloghash",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use((require, response, next) => {
    response.locals.success_msg = require.flash("success_msg");
    response.locals.error_msg = require.flash("error_msg");
    response.locals.error = require.flash('error');
    next();
});

app.use(express.static('public/'));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (require, response) => {
    response.render("home/index");
});

app.get("/erro", (require, response) => {
    response.render("erro/index");
});

app.post("/validation", (require, response) => {
    let cpf = String(require.body.cpf_validation);
    let count_separator = 0;
    let count_separator_two = 0;

    for (let i = 0; i < cpf.length; i++) {
        if (cpf[i] === '.') {
            count_separator++;
        }  
        
        if (cpf[i] === '-') {
            count_separator_two++;
        }
    }

    if (count_separator === 2 && count_separator_two == 1) {
        Validator(require.body.cpf_validation).then((cpfCheck) => {
            if (cpfCheck.error) {
                require.flash("error_msg", "A estrutura do CPF informado não é válida!");
                response.redirect("/");
            } else {
                if (cpfCheck.error === false && cpfCheck.validation === false) {
                    require.flash("error_msg", "O CPF informado não é válido!");
                    response.redirect("/");
                }

                if (cpfCheck.error === false && cpfCheck.validation === true) {
                    require.flash("success_msg", "O CPF informado é válido!");
                    response.redirect("/");
                }
            }
        }).catch((erro) => {
            require.flash("error_msg", "O CPF informado não é válido!");
            response.redirect("/");
        });
    } else {
        response.redirect("/erro");
    }
});

app.listen(PORT, () => {
    console.log('Aplication was started in port 3333...');
});