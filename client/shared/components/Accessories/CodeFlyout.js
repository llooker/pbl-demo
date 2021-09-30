import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Fade, ClickAwayListener, AppBar, Tabs, Tab, Box, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { appContextMap, validIdHelper } from '../../utils/tools';


export const CodeFlyout = (props) => {
  const { codeShow, setCodeShow, theme } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { classes, lookerUser, height, staticContent } = props;
  const { codeFlyoutContent } = staticContent || undefined;
  const tabs = [{
    label: "Looker User Object",
    component: CodeSnippet,
    props: {
      code: lookerUser
    }
  }]
  if (codeFlyoutContent && typeof codeFlyoutContent === "string") {
  } else if (codeFlyoutContent && typeof codeFlyoutContent === "object") {
    codeFlyoutContent.map(({ label, link }) => {
      tabs.push({
        label: label,
        component: Iframe,
        props: {
          src: link,
          style: {
            position: "absolute",
            height: "100%",
            width: "100%",
            border: "none",
          }
        }
      })
    })
  }

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
          //className={`${classes.codeFlyoutContainer} ${classes.positionTopRight} ${classes.padding0}`}
          className={`${classes.codeFlyoutContainer}`}
        >
          <Fade in={true}>
            <div className={classes.root}>
              <div style={{display: "flex", alignItems: "center"}}>
                <Typography variant="h4">Source & Code</Typography>
                <div>API Embed</div>
                <IconButton aria-label="close" className={classes.mlAuto} onClick={() => {
                      setValue(0)
                      setCodeShow()
                    }} >
                      <CloseIcon style={{ color: 'black', cursor: 'pointer' }} />
                    </IconButton>
              </div>
              <AppBar
                position="static"
                className={`${classes.maxHeight50}`}
                style={{ backgroundColor: "white", color: "#418CDD" }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange} aria-label="simple tabs example"
                  variant="scrollable"
                >
                  {tabs.map((item, index) => {
                    return (
                      <Tab
                        key={validIdHelper(`${item.label}-tab-index`)}
                        label={item.label}
                        {...a11yProps(index)} />
                    )
                  })}
                </Tabs>

              </AppBar>
              {tabs.map((item, index) => {
                const ComponentToRender = item.component;
                return (
                  <TabPanel
                    key={validIdHelper(`${item.label}-tabpanel-index`)}
                    value={value}
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
    <div style={{backgroundColor: "pink", paddingLeft: "1.5rem", overflow: "auto"}}>
      <SyntaxHighlighter
        language="json"
        style={{backgroundColor: "white"}}
        showLineNumbers={true} >
        {typeof code === "object" ? JSON.stringify(code, true, 4) : code}
      </SyntaxHighlighter>
    </div>)
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