import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { heroSelector } from '../../reducers/selectors';
import Heading from '../Heading';
import TabBar from '../TabBar';
import Spinner from '../Spinner';
import ErrorBox from '../Error/ErrorBox';
import Header from './Header';
import Benchmark from './Benchmark';
import Matchups from './Matchups';
import AttributesBlock from './AttributesBlock';

const HeroBlock = styled.div`
  margin-bottom: 8px;
`;

const HeroFooter = styled.div`
  text-align: center;
`;

const HeroDetailsButton = styled(FlatButton)`
  border: 1px solid rgba(0, 0, 0, .35) !important;
  margin: 8px auto !important;
  padding: 0 12px !important;
`;

const TabsBlock = styled.div`
  width: 100%;
`;

class Hero extends React.Component {
  constructor(props) {
    super(props);
    this.toggleDetailVisibility = this.toggleDetailVisibility.bind(this);
  }

  state = {
    detailsOpen: false,
  }

  toggleDetailVisibility(e) {
    e.preventDefault();

    this.setState({
      detailsOpen: !this.state.detailsOpen,
    });
  }

  render() {
    const { strings } = this.props;
    const route = this.props.match.params.info || 'benchmarks';
    const { heroId } = this.props.match.params;
    const hero = heroSelector(this.props.heroes, heroId);

    if (this.props.heroes.length === 0) {
      return <Spinner />;
    }

    if (!hero) {
      const errorText = `Hero ${heroId} not found...`;
      return <ErrorBox text={errorText} />;
    }

    const tabs = tabsHeroId => [
      {
        name: strings.tab_benchmarks,
        key: 'benchmarks',
        content: props => (
          <div>
            <Heading title={strings.tab_benchmarks} subtitle={strings.hero_disclaimer_public} />
            <Benchmark {...props} />
          </div>
        ),
        route: `/heroes/${tabsHeroId}/benchmarks`,
      },
      {
        name: strings.tab_matchups,
        key: 'matchups',
        content: props => (
          <div>
            <Heading title={strings.tab_matchups} subtitle={strings.hero_disclaimer_pro} />
            <Matchups {...props} />
          </div>
        ),
        route: `/heroes/${tabsHeroId}/matchups`,
      }
    ];

    const currentTab = tabs(heroId).find(tab => tab.key === route);
    return (
      <div>
        <Helmet title={hero.localized_name} />
        <HeroBlock>
          <Header hero={hero} />
          <HeroFooter>
            <HeroDetailsButton type="button" onClick={this.toggleDetailVisibility}>
              {this.state.detailsOpen ? strings.hide_details : strings.show_details}
            </HeroDetailsButton>
          </HeroFooter>
          {this.state.detailsOpen && <AttributesBlock hero={hero} />}
        </HeroBlock>
        <TabsBlock>
          <TabBar info={route} tabs={tabs(heroId)} />
          {currentTab ? currentTab.content(this.props) : null}
        </TabsBlock>
      </div>
    );
  }
}

const { shape, string, arrayOf } = PropTypes;

Hero.propTypes = {
  match: shape({
    params: shape({
      info: string,
      heroId: string,
    }),
  }),
  heroes: arrayOf(shape({})),
  strings: shape({}),
};

Hero.defaultProps = {
  heroes: [],
};

const mapStateToProps = state => ({
  isLoading: state.app.heroStats.loading,
  isError: state.app.heroStats.error,
  heroes: state.app.heroStats.data,
  strings: state.app.strings,
});

export default connect(mapStateToProps)(Hero);
