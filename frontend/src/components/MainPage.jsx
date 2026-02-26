import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VolatilityChart from './VolatilityChart';

function MainPage() {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token) {
            navigate('/login');
            return;
        }
        
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputText.trim()) {
            setError('Please enter a news article');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                'http://localhost:5000/api/ml/predict',
                { news_article: inputText },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setPrediction(response.data);
            } else {
                setError(response.data.error || 'Failed to get prediction');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error connecting to prediction service');
            console.error('Prediction error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getVolatilityBadge = (volatility) => {
        const variant = volatility === 'High Volatile' ? 'danger' : 
                       volatility === 'Medium Volatile' ? 'warning' : 'success';
        return <Badge bg={variant} className="p-2">{volatility}</Badge>;
    };

    return (
        <Container className="main-container py-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    {/* Welcome message */}
                    {user && (
                        <Alert variant="info" className="mb-4">
                            Welcome back, <strong>{user.name}</strong>! Enter a news article to analyze its impact on Tesla stock.
                        </Alert>
                    )}

                    <Card className="p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">News2NetWorth Analyzer</h2>
                            <p className="text-center text-light mb-4">
                                Analyze news articles to predict stock volatility using AI
                            </p>
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label>News Article</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={6}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Paste or type the news article about Tesla here..."
                                        required
                                        style={{ backgroundColor: '#2c3034', color: 'white', borderColor: '#0d6efd' }}
                                    />
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100"
                                    disabled={loading}
                                    size="lg"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Analyzing with AI...
                                        </>
                                    ) : (
                                        'Analyze News Article'
                                    )}
                                </Button>
                            </Form>

                            {error && (
                                <Alert variant="danger" className="mt-4">
                                    {error}
                                </Alert>
                            )}

                            {prediction && (
                                <div className="mt-5">
                                    <h3 className="text-center mb-4">Analysis Results</h3>
                                    
                                    {/* Colab GPU Status - Optional but nice */}
                                    {prediction.gpu_used && (
                                        <Alert variant="success" className="mb-4">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">🚀</span>
                                                <span>Running on Colab GPU - Faster processing!</span>
                                            </div>
                                        </Alert>
                                    )}
                                    
                                    {/* Main Volatility Card */}
                                    <Card className="mb-4" style={{ backgroundColor: '#1a1e21', borderColor: '#0d6efd' }}>
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                <Col md={6} className="text-center">
                                                    <h4>Volatility Prediction</h4>
                                                    <div style={{ fontSize: '2.5rem', marginTop: '1rem' }}>
                                                        {getVolatilityBadge(prediction.volatility)}
                                                    </div>
                                                </Col>
                                                <Col md={6} className="text-center">
                                                    <h4>Confidence Score</h4>
                                                    <div style={{ fontSize: '2rem', color: '#0d6efd' }}>
                                                        {prediction.confidence?.toFixed(1)}%
                                                    </div>
                                                    <ProgressBar 
                                                        now={prediction.confidence} 
                                                        variant={prediction.confidence > 70 ? 'success' : 'warning'}
                                                        className="mt-2"
                                                        style={{ height: '10px' }}
                                                    />
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    {/* Sentiment Analysis - FIXED: using prediction.sentiment */}
                                    <Card className="mb-4">
                                        <Card.Body>
                                            <h4 className="mb-3">Sentiment Analysis</h4>
                                            <Row>
                                                <Col md={4} className="text-center mb-3">
                                                    <h5 style={{ color: '#dc3545' }}>Negative</h5>
                                                    <div style={{ fontSize: '1.5rem' }}>
                                                        {prediction.sentiment?.negative.toFixed(1)}%
                                                    </div>
                                                    <ProgressBar 
                                                        now={prediction.sentiment?.negative} 
                                                        variant="danger"
                                                        className="mt-2"
                                                    />
                                                </Col>
                                                <Col md={4} className="text-center mb-3">
                                                    <h5 style={{ color: '#ffc107' }}>Neutral</h5>
                                                    <div style={{ fontSize: '1.5rem' }}>
                                                        {prediction.sentiment?.neutral.toFixed(1)}%
                                                    </div>
                                                    <ProgressBar 
                                                        now={prediction.sentiment?.neutral} 
                                                        variant="warning"
                                                        className="mt-2"
                                                    />
                                                </Col>
                                                <Col md={4} className="text-center mb-3">
                                                    <h5 style={{ color: '#28a745' }}>Positive</h5>
                                                    <div style={{ fontSize: '1.5rem' }}>
                                                        {prediction.sentiment?.positive.toFixed(1)}%
                                                    </div>
                                                    <ProgressBar 
                                                        now={prediction.sentiment?.positive} 
                                                        variant="success"
                                                        className="mt-2"
                                                    />
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    {/* Market Data */}
                                    {prediction.market_data && (
                                        <Card className="mb-4">
                                            <Card.Body>
                                                <h4 className="mb-3">Market Data</h4>
                                                <Row>
                                                    <Col md={6} className="text-center">
                                                        <h5>Latest Price</h5>
                                                        <p style={{ fontSize: '1.8rem', color: '#0d6efd' }}>
                                                            ${prediction.market_data.latest_price.toFixed(2)}
                                                        </p>
                                                    </Col>
                                                    <Col md={6} className="text-center">
                                                        <h5>24h Change</h5>
                                                        <p style={{ 
                                                            fontSize: '1.8rem', 
                                                            color: prediction.market_data.price_change > 0 ? '#28a745' : '#dc3545'
                                                        }}>
                                                            {prediction.market_data.price_change > 0 ? '+' : ''}
                                                            {prediction.market_data.price_change.toFixed(2)}%
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    )}

                                    {/* Explanation - Your model might not have this yet */}
                                    {prediction.explanation && (
                                        <Card>
                                            <Card.Body>
                                                <h4 className="mb-3">AI Explanation</h4>
                                                <p className="lead" style={{ fontStyle: 'italic' }}>
                                                    "{prediction.explanation}"
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default MainPage;