import React from 'react';
import PropTypes from 'prop-types';
import heroes from 'dotaconstants/build/heroes.json';
import Heading from '../Heading';
import Purchases from '../Match/Purchases';
import Timeline from '../Match/Overview/Timeline';
import MatchGraph from '../Visualizations/Graph/MatchGraph';
import CrossTable from './CrossTable';
import mcs from './matchColumns';
import Overview from './Overview';
import TeamTable from './TeamTable';
import { StyledFlexContainer, StyledFlexElement } from './StyledMatch';
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
  const {
    analysisColumns,
    inflictorsColumns,
  } = mcs(strings);

  const gosuUrl = 'https://gosu.ai/dota/?utm_source=opendota&utm_medium=cpc&utm_campaign=';
  const gosuIcon = '/assets/images/gosu-24px.png';

  return [Overview(strings, gosuUrl, gosuIcon), 
   {
    name: strings.tab_combat,
    key: 'combat',
    skeleton: true,
    parsed: true,
    content: match => (
      <div>
        {process.env.ENABLE_GOSUAI &&
        <Heading
          buttonLabel={strings.gosu_combat}
          buttonTo={`${gosuUrl}Combat`}
          buttonIcon={gosuIcon}
        />
        }
        <StyledFlexContainer>
          <StyledFlexElement>
            <Heading title={strings.heading_kills} />
            <CrossTable match={match} field1="killed" field2="killed_by" />
          </StyledFlexElement>
          <StyledFlexElement>
            <Heading title={strings.heading_damage} />
            <CrossTable match={match} field1="damage" field2="damage_taken" />
          </StyledFlexElement>
        </StyledFlexContainer>
        <TeamTable
          players={match.players}
          columns={inflictorsColumns}
          heading={strings.heading_damage}
          radiantTeam={match.radiant_team}
          direTeam={match.dire_team}
          radiantWin={match.radiant_win}
        />
      </div>),
  }, {
    name: strings.tab_items,
    key: 'purchases',
    skeleton: true,
    parsed: true,
    content: match => (
      <div>
        <Purchases
          match={match}
          sponsorURL={gosuUrl}
          sponsorIcon={gosuIcon}
        />
      </div>),
  }, {
    name: strings.tab_graphs,
    key: 'graphs',
    skeleton: true,
    parsed: true,
    content: match => (
      <div>
        <Timeline match={match} />
        <MatchGraph match={match} type="difference" sponsorURL={gosuUrl} sponsorIcon={gosuIcon} />
        <MatchGraph match={match} type="gold" />
        <MatchGraph match={match} type="xp" />
        <MatchGraph match={match} type="lh" />
      </div>),
  }, 
  {
    name: strings.tab_analysis,
    key: 'analysis',
    parsed: true,
    content: match => (
      <div>
        <TeamTable
          players={match.players}
          columns={analysisColumns}
          heading={strings.heading_analysis}
          buttonLabel={process.env.ENABLE_GOSUAI ? strings.gosu_analysis : null}
          buttonTo={`${gosuUrl}Analysis`}
          buttonIcon={gosuIcon}
          radiantTeam={match.radiant_team}
          direTeam={match.dire_team}
          radiantWin={match.radiant_win}
        />
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
