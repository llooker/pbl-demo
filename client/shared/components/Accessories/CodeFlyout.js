import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Fade, ClickAwayListener, AppBar, Tabs, Tab, Box, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { appContextMap } from '../../utils/tools';

export const CodeFlyout = (props) => {
  const { codeShow, setCodeShow, theme } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { classes, lookerUser, height, staticContent } = props;
  const codeSandboxEmbedLink = staticContent.codeSandboxEmbedLink || undefined;
  const tabs = [{
    label: "Looker User Object",
    component: CodeSnippet,
    props: {
      code: lookerUser
    }
  }]
  if (codeSandboxEmbedLink) tabs.push({
    label: "Code Sandbox",
    component: Iframe,
    props: {
      src: codeSandboxEmbedLink,
      style: {
        position: "absolute",
        height: "100%",
        width: "100%",
        border: "none",
      }
    }
  })
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    codeShow ?

      <ClickAwayListener onClickAway={() => {
        setValue(0)
        setCodeShow()
      }}>
        <Grid container
          sm={8}
          className={`${classes.codeFlyoutContainer} ${classes.positionTopRight} ${classes.padding0}`}
        >
          <Fade in={true}>
            <div className={classes.root}>
              <AppBar
                position="static"
                className={`${classes.maxHeight50}`}
                style={{ backgroundColor: theme.palette.fill.main }}
              >
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
                  variant="scrollable"
                >
                  {tabs.map((item, index) => {
                    return (
                      <Tab label={item.label} {...a11yProps(index)} />
                    )
                  })}
                  <IconButton aria-label="close" className={classes.mlAuto} onClick={() => {
                    setValue(0)
                    setCodeShow()
                  }} >
                    <CloseIcon style={{ color: 'white', cursor: 'pointer' }} />
                  </IconButton>
                </Tabs>

              </AppBar>
              {tabs.map((item, index) => {
                const ComponentToRender = item.component;
                return (
                  <TabPanel value={value}
                    index={index}
                    classes={classes}
                  >
                    <ComponentToRender {...item.props}></ComponentToRender>
                  </TabPanel>)
              })}
            </div>
          </Fade >
        </Grid >
      </ClickAwayListener >
      : ""
  )
}

function CodeSnippet(props) {
  const { code } = props
  return (
    <SyntaxHighlighter
      language="json"
      showLineNumbers={true} >
      {typeof code === "object" ? JSON.stringify(code, true, 4) : code}
    </SyntaxHighlighter>)
}

function Iframe(props) {
  const { src, style } = props
  return (
    <iframe src={src} style={style} />)
}

function TabPanel(props) {
  const { children, value, index, classes, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}