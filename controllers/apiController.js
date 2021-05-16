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
        "SELECT country.code, country.name as country, trim(from city.name) capital FROM country " +
        "INNER JOIN city ON city.id=country.capital " +
        "WHERE country.continent='" + req.params.name + "':: varchar " +
        "ORDER BY country.name ASC"
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

    //d. näidata täielikku teavet määratud riigi kohta (teave riigi ja linnade kohta). Andmete lugemiseks looge ka 2 päringut: riigi koodi ja nime järgi. 
    app.get("/api/countrybyname/:name", function (req, res) {
        db.any(
        "SELECT c.code as country_code, c.name as country_name, c.continent, c.region, c.surfacearea, " +
        "c.indepyear, c.population as country_population, c.lifeexpectancy, c.gnp, c.gnpold, c.localname, c.governmentform, " +
        "c.headofstate, c.capital, c.code2, city.id as city_id, trim(from city.name) city_name, " +
        "trim(from city.district) city_district, city.population as city_population " +
        "FROM city " +
        "INNER JOIN country as c ON c.code=city.countrycode " +
        "WHERE c.name LIKE '%" + req.params.name + "%':: varchar"
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
    
    //d. näidata täielikku teavet määratud riigi kohta (teave riigi ja linnade kohta). Andmete lugemiseks looge ka 2 päringut: riigi koodi ja nime järgi. 
    app.get("/api/countrybycode/:code", function (req, res) {
        db.any(
        "SELECT c.code as country_code, c.name as country_name, c.continent, c.region, c.surfacearea, " +
        "c.indepyear, c.population as country_population, c.lifeexpectancy, c.gnp, c.gnpold, c.localname, c.governmentform, " +
        "c.headofstate, c.capital, c.code2, city.id as city_id, trim(from city.name) city_name, " +
        "trim(from city.district) city_district, city.population as city_population " +
        "FROM city " +
        "INNER JOIN country as c ON c.code=city.countrycode " +
        "WHERE c.code='" + req.params.code + "':: varchar"
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



    // praktika 5 jaoks
    app.get("/api/continents", function (req, res) {
        db.any("SELECT DISTINCT continent FROM country")
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
    

