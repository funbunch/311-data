import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  locationInfo: {
    borderRadius: 10,
    width: 325,
    backgroundColor: theme.palette.primary.main,
    padding: 15,
    marginTop: theme.gaps.xs,
  },
  header: {
    color: theme.palette.text.cyan,
    letterSpacing: '2px',
  },
  subheader: {
    ...theme.typography.body2,
    color: '#A8A8A8',
  },
  link: {
    ...theme.typography.h2,
    color: '#ececec',
  },
}));

const LocationDetail = ({
  address,
  nc,
  // ccs,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.locationInfo}>
      <Typography
        className={classes.header}
        variant="h1"
        component="h2"
      >
        INFORMATION
      </Typography>
      {address && (
        <Box mt={1}>
          <Typography component="div" className={classes.subheader}>Address:</Typography>
          <Typography component="span">{address}</Typography>
        </Box>
      )}
      {nc && (
        <Box mt={1}>
          <Typography component="div" className={classes.subheader}>Neighborhood Council District:</Typography>
          <Link
            className={classes.link}
            href={nc.website}
            target="_blank"
            rel="noopener"
            underline="always"
          >
            {nc.councilName}
          </Link>
        </Box>
      )}
    </div>
  );
};

export default LocationDetail;

LocationDetail.propTypes = {
  address: PropTypes.string,
  nc: PropTypes.shape({
    website: PropTypes.string,
    councilName: PropTypes.string,
  }),
};

LocationDetail.defaultProps = {
  address: undefined,
  nc: null,
};
