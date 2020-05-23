import React from 'react';
import PropTypes from 'prop-types';
import heroes from 'dotaconstants/build/heroes.json';
import MatchGraph from '../Visualizations/Graph/MatchGraph';
import { getHeroImageUrl, IMAGESIZE_ENUM } from '../../utility';

const TickElement = (props) => {
  const { x, y, payload } = props;

  if (heroes[payload.value]) {
    const href = getHeroImageUrl(payload.value, IMAGESIZE_ENUM.SMALL.suffix);
    const imageProps = {
      xlinkHref: href,
      href,
      width: IMAGESIZE_ENUM.SMALL.width,
      height: IMAGESIZE_ENUM.SMALL.height,
      x: (x - (IMAGESIZE_ENUM.SMALL.width / 2)),
      y,
    };

    return <image {...imageProps} />;
  }

  return null;
};
TickElement.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({}),
};


const matchPages = (strings) => {
  const gosuUrl = 'https://gosu.ai/dota/?utm_source=opendota&utm_medium=cpc&utm_campaign=';
  const gosuIcon = '/assets/images/gosu-24px.png';

  return [ 
   {
    name: strings.tab_graphs,
    key: 'graphs',
    skeleton: true,
    parsed: true,
    content: match => (
      <div>
        <MatchGraph match={match} type="difference" sponsorURL={gosuUrl} sponsorIcon={gosuIcon} />
        <MatchGraph match={match} type="gold" />
        <MatchGraph match={match} type="xp" />
        <MatchGraph match={match} type="lh" />
      </div>),
  }
];
};

export default (matchId, match, strings) => matchPages(strings).map(page => ({
  // ...page,
  name: page.name,
  key: page.key,
  parsed: page.parsed,
  content: page.content,
  route: `/matches/${matchId}/${page.key.toLowerCase()}`,
  disabled: match && !match.version && page.parsed,
  hidden: m => page.hidden && page.hidden(m),
  skeleton: page.skeleton,
}));
