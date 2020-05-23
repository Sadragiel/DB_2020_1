import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

import BenchmarkGraph from './BenchmarkGraph';
import constants from '../constants';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 48px -8px;

  @media screen and (max-width: ${constants.wrapMobile}) {
    display: block;
    margin-left: 0;
    margin-right: 0;
  }
`;

const buildLabel = (title, correlation) => {
  if(!correlation) return title;
  // eslint-disable-next-line no-unused-vars
  let conclution = `Корреляция - ${correlation > 0 ? 'положительная' : 'отрицательная' } и `;
  if(Math.abs(correlation) < 0.3) {
    conclution += 'очень слабая';
  }
  else if(Math.abs(correlation) < 0.5) {
    conclution += 'слабая';
  }
  else if(Math.abs(correlation) < 0.7) {
    conclution += 'средняя';
  }
  else if(Math.abs(correlation) < 0.9) {
    conclution += 'высокая';
  }
  else {
    conclution += 'очень высокая';
  }
  return `${title}. ${conclution} и равна ${correlation}`;
}

const mapData = (data, key) => data.map(item => ({ Percentage: (`${item.percentile * 100}%`), Value: typeof item[key] === 'number' && Number(item[key].toFixed(2)) }));

const getData = (data, correlation, strings) => [
  { title: buildLabel(strings.tooltip_gold_per_min, correlation.gold_per_min), data: mapData(data, 'gold_per_min'), color: constants.golden },
  { title: buildLabel(strings.tooltip_xp_per_min, correlation.xp_per_min), data: mapData(data, 'xp_per_min'), color: constants.blue },
];

const renderGraphs = data => data.map(graphData => 
  <BenchmarkGraph key={graphData.title} data={graphData} />);

const BenchmarkGraphs = ({ data, correlation, strings }) => {
  const mappedData = getData(data, correlation, strings);
  return (
    <Wrapper>
      { renderGraphs(mappedData) }
    </Wrapper>
  );
};

BenchmarkGraphs.propTypes = {
  data: propTypes.arrayOf(propTypes.shape({})),
  strings: propTypes.shape({}),
};

export default BenchmarkGraphs;
