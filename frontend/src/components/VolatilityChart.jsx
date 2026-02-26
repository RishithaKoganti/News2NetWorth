import React from 'react';
import { Card } from 'react-bootstrap';

function VolatilityChart({ prediction }) {
    if (!prediction) return null;

    const getVolatilityColor = (level) => {
        if (level === 'High Volatile') return '#dc3545';
        if (level === 'Medium Volatile') return '#ffc107';
        return '#28a745';
    };

    return (
        <Card className="mt-4">
            <Card.Body>
                <h5 className="text-center mb-3">Volatility Gauge</h5>
                <div style={{ 
                    width: '100%', 
                    height: '30px', 
                    background: 'linear-gradient(90deg, #28a745 0%, #ffc107 50%, #dc3545 100%)',
                    borderRadius: '15px',
                    position: 'relative',
                    marginBottom: '10px'
                }}>
                    <div style={{
                        width: '20px',
                        height: '40px',
                        backgroundColor: 'white',
                        border: '2px solid #0d6efd',
                        borderRadius: '5px',
                        position: 'absolute',
                        left: prediction.volatility === 'High Volatile' ? '90%' :
                               prediction.volatility === 'Medium Volatile' ? '50%' : '10%',
                        top: '-5px',
                        transform: 'translateX(-50%)'
                    }}></div>
                </div>
                <div className="d-flex justify-content-between">
                    <span>Low Risk</span>
                    <span>Medium Risk</span>
                    <span>High Risk</span>
                </div>
            </Card.Body>
        </Card>
    );
}

export default VolatilityChart;