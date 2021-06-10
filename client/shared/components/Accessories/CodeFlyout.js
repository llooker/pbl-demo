import React, { useContext } from 'react';

import { Typography, Grid, Fade, ClickAwayListener } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { appContextMap } from '../../utils/tools';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';


export const CodeFlyout = (props) => {
  console.log("CodeFlyout")
  const { codeShow, setCodeShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { classes, lookerUser, height, staticContent } = props;
  console.log({ staticContent })
  console.log({ codeShow })

  const codeSandboxEmbedLink = staticContent.codeSandboxEmbedLink || {}
  console.log({ codeSandboxEmbedLink })
  const tabs = [lookerUser, codeSandboxEmbedLink]
  console.log({ tabs })

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    codeShow ?
      <Grid item sm={6}
        className={`${classes.positionTopRight} ${classes.padding0}`}>
        <Grid container
          className={`${classes.codeFlyoutContainer}`} //${classes.padding20} 
          style={{ height }}
        >
          <AppBar position="static" className={classes.maxHeight50}>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              {tabs.map((item, index) => {
                return (
                  <Tab label={index === 0 ? "Looker User Object" : "Code Sandbox"} {...a11yProps(index)} />
                )
              })}
            </Tabs>
          </AppBar>
          {tabs.map((item, index) => {
            return (
              <TabPanel value={value} index={index}
              >
                {index === 0 ?
                  <CodeSnippet code={lookerUser} />
                  :
                  <iframe src={codeSandboxEmbedLink}
                    style={{
                      position: "absolute",
                      height: "100%",
                      border: "none"
                    }} />
                }
              </TabPanel>)
          })}
        </Grid>
      </Grid>
      : ""
  )
}

function CodeSnippet(props) {
  const { code } = props
  return (
    <SyntaxHighlighter language="json" style={dracula} showLineNumbers={true} >
      {typeof code === "object" ? JSON.stringify(code, true, 4) : code}
    </SyntaxHighlighter>)
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
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