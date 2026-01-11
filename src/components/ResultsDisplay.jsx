import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results }) => {
    if (!results) return null;

    return (
        <div className="results-container fade-in">
            <h2 className="results-title">Fundamental Subspaces</h2>

            <div className="matrix-info" style={{ animationDelay: '0.1s' }}>
                <div className="info-card">
                    <span className="info-label">Dimensions</span>
                    <span className="info-value">{results.matrix.rows} × {results.matrix.cols}</span>
                </div>
                <div className="info-card highlight">
                    <span className="info-label">Rank</span>
                    <span className="info-value">{results.rank}</span>
                </div>
            </div>

            <div className="rref-section" style={{ animationDelay: '0.2s' }}>
                <h3>Row-Reduced Echelon Form (RREF)</h3>
                <LaTeXDisplay latex={results.rref.latex} />
                <p className="pivot-info">Pivot columns: {results.rref.pivots.map(p => p + 1).join(', ') || 'None'}</p>
            </div>

            <div className="dimension-theorem" style={{ animationDelay: '0.3s' }}>
                <h3>Dimension Theorem Check</h3>
                <div className="theorem-cards">
                    <div className="theorem-card">
                        <span>rank(A) + dim(Null A) = n</span>
                        <span className="theorem-value">{results.dimension_check.rank_plus_nullity}</span>
                    </div>
                    <div className="theorem-card">
                        <span>rank(A) + dim(Left Null A) = m</span>
                        <span className="theorem-value">{results.dimension_check.rank_plus_left_nullity}</span>
                    </div>
                </div>
            </div>

            <div className="subspaces-grid">
                <div style={{ animationDelay: '0.4s' }}>
                    <SubspaceCard
                        name="Column Space"
                        symbol="C(A)"
                        data={results.column_space}
                        color="indigo"
                    />
                </div>
                <div style={{ animationDelay: '0.5s' }}>
                    <SubspaceCard
                        name="Row Space"
                        symbol="C(Aᵀ)"
                        data={results.row_space}
                        color="purple"
                    />
                </div>
                <div style={{ animationDelay: '0.6s' }}>
                    <SubspaceCard
                        name="Null Space"
                        symbol="N(A)"
                        data={results.null_space}
                        color="blue"
                    />
                </div>
                <div style={{ animationDelay: '0.7s' }}>
                    <SubspaceCard
                        name="Left Null Space"
                        symbol="N(Aᵀ)"
                        data={results.left_null_space}
                        color="cyan"
                    />
                </div>
            </div>
        </div>
    );
};

const LaTeXDisplay = ({ latex }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && latex) {
            try {
                katex.render(latex, containerRef.current, {
                    throwOnError: false,
                    displayMode: true,
                });
            } catch (e) {
                containerRef.current.textContent = latex;
            }
        }
    }, [latex]);

    return <div ref={containerRef} className="latex-display"></div>;
};

const SubspaceCard = ({ name, symbol, data, color }) => {
    return (
        <div className={`subspace-card subspace-${color}`}>
            <div className="subspace-header">
                <h4>{name}</h4>
                <span className="subspace-symbol">{symbol}</span>
            </div>
            <div className="subspace-meta">
                <span className="dimension-badge">dim = {data.dimension}</span>
                <span className="description">{data.description}</span>
            </div>
            <div className="subspace-basis">
                {data.dimension === 0 ? (
                    <p className="trivial-space">Trivial (only zero vector)</p>
                ) : (
                    <div className="basis-vectors">
                        <span className="basis-label">Basis:</span>
                        {data.latex.map((vec, idx) => (
                            <div key={idx} className="vector-container">
                                <span className="vector-label">v<sub>{idx + 1}</sub> =</span>
                                <LaTeXDisplay latex={vec} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsDisplay;
