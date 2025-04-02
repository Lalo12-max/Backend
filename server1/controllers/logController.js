const db = require('../config/database');

const getLogStats = async (req, res) => {
    try {
        console.log('Fetching log stats...');
        const { rows: results } = await db.query(`
            SELECT 
                method,
                path,
                status_code,
                COUNT(*) as count,
                DATE_TRUNC('day', timestamp) as date
            FROM logs 
            GROUP BY method, path, status_code, DATE_TRUNC('day', timestamp)
            ORDER BY date DESC, status_code
        `);
        
        console.log('Log stats results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching log stats:', error);
        res.status(500).json({ 
            error: 'Error al obtener estadísticas',
            details: error.message 
        });
    }
};

const getAllLogs = async (req, res) => {
    try {
        console.log('Fetching all logs...');
        const { rows } = await db.query(`
            SELECT 
                id,
                method,
                path,
                status_code,
                response_time,
                ip_address,
                timestamp
            FROM logs 
            ORDER BY timestamp DESC 
            LIMIT 100
        `);
        
        console.log('Number of logs retrieved:', rows.length);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching all logs:', error);
        res.status(500).json({ 
            error: 'Error al obtener logs',
            details: error.message 
        });
    }
};

const getRouteDistribution = async (req, res) => {
    try {
        console.log('Fetching route distribution...');
        const { rows: results } = await db.query(`
            SELECT 
                path,
                COUNT(*) as count
            FROM logs 
            GROUP BY path
            ORDER BY count DESC
        `);
        
        console.log('Route distribution results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching route distribution:', error);
        res.status(500).json({ 
            error: 'Error al obtener distribución de rutas',
            details: error.message 
        });
    }
};

module.exports = {
    getLogStats,
    getAllLogs,
    getRouteDistribution
};
