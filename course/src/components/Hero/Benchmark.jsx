import React, { Component } from 'react';
import { shape, func, bool, arrayOf, oneOfType, string } from 'prop-types';
import { connect } from 'react-redux';
import { getBenchmark } from '../../actions';
import BenchmarkGraphs from './BenchmarkGraphs';
import BenchmarkSkeleton from '../Skeletons/BenchmarkSkeleton';

const renderBenchmark = (hero, data, correlation, strings) => (
  <div>
    <BenchmarkGraphs correlation={correlation} data={data} strings={strings} />
  </div>
);

class Benchmark extends Component {
  static propTypes = {
    match: shape({
      params: shape({
        heroId: string,
      }),
    }),
    strings: shape({}),
    getBenchmark: func,
    isLoading: bool,
    isError: bool,
    hero: shape({}),
    result: oneOfType([
      arrayOf(shape({})),
      shape({}),
    ]),
  }

  componentDidMount() {
    if (
      this.props.match.params &&
      this.props.match.params.heroId
    ) {
      this.props.getBenchmark(this.props.match.params.heroId);
    }
  }

  render() {
    const {
      isLoading, isError, hero, result, correlation,
    } = this.props;

    return (
      <div>
        {isLoading || isError || result === null ? (
          <BenchmarkSkeleton />
        ) : (
          renderBenchmark(hero, result, correlation, this.props.strings)
        )}
      </div>
    );
  }
}

/**
HISTOGRAM API

<Histogram
  title: string
  binWidth: number (px)
>
  <HistogramBin
    height: number (px)
    color: hex
    style: object
  />
  <HistogramLegend
    position: enum
    label: string
    value: array
  />
</Hisogram>


<MultiHistogram>
  <HistogramItem>
  </HistogramItem>
</MultiHistogram>

*/

const mapStateToProps = state => ({
  isLoading: state.app.heroBenchmark.loading,
  isError: state.app.heroBenchmark.error,
  result: state.app.heroBenchmark.data.result,
  correlation: state.app.heroBenchmark.data.correlation,
});

const mapDispatchToProps = dispatch => ({
  getBenchmark: heroId => dispatch(getBenchmark(heroId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Benchmark);
