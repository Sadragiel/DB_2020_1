import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Why from './Why';
import { HeadContainerDiv, HeadlineDiv, DescriptionDiv } from './Styled';

const Home = ({ strings }) => (
  <div>
    <HeadContainerDiv>
      <HeadlineDiv>
        {strings.app_name}
      </HeadlineDiv>
      <DescriptionDiv>
        {strings.app_description}
      </DescriptionDiv>
    </HeadContainerDiv>
    <Why />
  </div>
);

Home.propTypes = {
  strings: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  content: state.content,
  strings: state.app.strings,
});

export default connect(mapStateToProps)(Home);
