const express = require('express');
const sql = require('mssql/msnodesqlv8');

const app = express();
app.use(express.json());
const port = 3000;

const config = {
    server: ".",
    database: "NutriFit",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: "msnodesqlv8"
};

// const connectionString = "server=.;Database=NutriFit;Trusted_Connection=yes;Driver={SQL Server Native Client 11.0}";

// Contoh Query
const connectionString = "server=.;Database=NutriFit;Trusted_Connection=yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT TOP 10 * FROM [NutriFit].[user]"; // Correct table name format

app.get('/getUser', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query(query);
        return res.json(result.recordset);
    } catch(err) {
        console.error(err);
        return res.status(500).json({error: err.message});
    } finally {
        sql.close();
    }
});


// Status endpoint
app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.json(status);
});


// Start server
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
