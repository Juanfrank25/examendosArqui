const connection = require("../db/connection");
const imageToBase64 = require('image-to-base64');
const sql = require('mssql');
const asignationCTRL = {};

asignationCTRL.getEmpleado = async (req, res) => {
    const resp = await (await connection()).request().query("SELECT * FROM Dato_Biometrico");
    (await connection()).close()
    res.json({ success: true, resp });
};

asignationCTRL.valEmpleado = async (req, res) => {
    const currentConnection = (await connection());
    const base64 = await imageToBase64(req.body.urlImg)
    const respDB = await getDatoBiometricoByValor(currentConnection, base64)
    if (respDB.recordset.length > 0) {
        const datoBiometrico = respDB.recordset[0];
        const respEm = await getEmpleadoById(currentConnection, datoBiometrico.id_Empleado)
        console.log(respEm,datoBiometrico)
        if (respEm.recordset.length > 0) {
            if (validarDatos(req.body.day, respEm.recordset[0])) {
                res.json({ success: true });
            } else res.json({ success: false, msg: "NO es turno del Empleado." });
        } else res.json({ success: false, msg: "No existe el empleado en la Compañia." });
    } else res.json({ success: false, msg: "Sin existencia en la base de datos." });
    currentConnection.close()
};

const getDatoBiometricoByValor = async (currentConnection, valor) => await currentConnection.request()
    .input('imagen', sql.VarChar, valor)
    .query(`SELECT * FROM Dato_Biometrico WHERE VALOR = @imagen`);

const getEmpleadoById = async (currentConnection, id) => await currentConnection.request()
    .input('id', sql.Int, id)
    .query(`SELECT * FROM Empleado WHERE id_Empleado = @id`);

const validarDatos = (day, empleado) => {
    const lastDPINumber = parseInt(empleado.DPI_Empleado.toString().slice(empleado.DPI_Empleado.length - 1))
    if (lastDPINumber == 1 || lastDPINumber == 4 || lastDPINumber == 7)
        if (day == 'Lunes') return true;
    if (lastDPINumber == 2 || lastDPINumber == 5 || lastDPINumber == 8)
        if (day == 'Martes') return true;
    if (lastDPINumber == 3 || lastDPINumber == 6 || lastDPINumber == 9)
        if (day == 'Miercoles') return true;
    if (lastDPINumber == 4 || lastDPINumber == 5 || lastDPINumber == 9 || lastDPINumber == 0)
        if (day == 'Jueves') return true;
    if (lastDPINumber == 1 || lastDPINumber == 6 || lastDPINumber == 8 || lastDPINumber == 0)
        if (day == 'Viernes') return true;
    if (lastDPINumber == 2 || lastDPINumber == 3 || lastDPINumber == 7)
        if (day == 'Sabado') return true;
    return false;
}

module.exports = asignationCTRL;