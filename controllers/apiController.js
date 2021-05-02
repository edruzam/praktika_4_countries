var config = require("../config");
var pgp = require("pg-promise")();
var db = pgp(config.getDbConnectionString());

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.send('Hello, World');
    });

    // a. näidata kõiki riike 
    app.get("/api/countries", function (req, res) {
        db.any("SELECT DISTINCT name FROM country")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(error => {
                if (Array.isArray(error) && 'getErrors' in error) {
                    // the error came from method `batch`;
                    // let's log the very first error:
                    error = error.getErrors()[0];
                }
                console.log("ERROR:", error.message || error);
            });
    });

    // b. näidata kõiki määratud mandri riike (riigi nimi, pealinn) 
    app.get("/api/continent/:name/countries", function (req, res) {
        db.any(
        "SELECT country.name as country, trim(from city.name) capital FROM country " +
        "INNER JOIN city ON city.id=country.capital " +
        "WHERE country.continent='" + req.params.name + "':: varchar"
        )
        .then(function (data) {
            res.json({
                status: "success",
                data: data,
            });
        })
        .catch(error => {
            if (Array.isArray(error) && 'getErrors' in error) {
                // the error came from method `batch`;
                // let's log the very first error:
                error = error.getErrors()[0];
            }
            console.log("ERROR:", error.message || error);
        });
    });


    // c. näidata täielikku teavet määratud linna kohta (2 GET - päringut: linnakoodi ja nime järgi) 
    app.get("/api/citybyname/:name", function (req, res) {
        db.any(
            "SELECT id, trim(from name) city_name, countrycode, trim(from district) city_district, population FROM city WHERE name LIKE '%" + req.params.name + "%':: varchar"
            )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(error => {
                if (Array.isArray(error) && 'getErrors' in error) {
                    // the error came from method `batch`;
                    // let's log the very first error:
                    error = error.getErrors()[0];
                }
                console.log("ERROR:", error.message || error);
            });
    });

    // c. näidata täielikku teavet määratud linna kohta (2 GET - päringut: linnakoodi ja nime järgi) 
    app.get("/api/citybyid/:id", function (req, res) {
        db.any(
            "SELECT id, trim(from name) city_name, countrycode, trim(from district) city_district, population FROM city WHERE city.id=" + req.params.id + ":: integer"
            )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(error => {
                if (Array.isArray(error) && 'getErrors' in error) {
                    // the error came from method `batch`;
                    // let's log the very first error:
                    error = error.getErrors()[0];
                }
                console.log("ERROR:", error.message || error);
            });
    });


    
};