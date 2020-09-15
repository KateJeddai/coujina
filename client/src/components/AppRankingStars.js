import React from 'react';
import '../styles/AppRankingStars.scss';

const AppRankingStars = (props) => {
    const {recipeData, rank} = props;
    const rankingPercent = recipeData.ranking && Math.round(recipeData.ranking.rank / 5 * 100);
    const rankingStyle = {
        width: rankingPercent + '%'
    };

    return (
        <div className="rating-stars-wrapper">
            <div className="stars-outer">
                <div className="stars-inner" style={rankingStyle}></div>
            </div>
            <div className="rank-number">{rank}</div>
        </div>
    )
}

export default AppRankingStars;
