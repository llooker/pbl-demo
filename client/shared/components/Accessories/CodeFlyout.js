import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Fade, ClickAwayListener, AppBar, Tabs, Tab, Box, IconButton, Link } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { appContextMap, validIdHelper } from '../../utils/tools';
import { API_COLOR, API_BACKGROUND_COLOR, EMBED_COLOR, EMBED_BACKGROUND_COLOR } from "./Highlight";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PhoneIcon from '@material-ui/icons/Phone';

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
            height: "75vh",
            width: "100%",
            border: "none",
            paddingRight: "2rem",
            paddingBottom: "2rem"
          }
        }
      })
    })
  }

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function close() {
    setValue(0)
    setCodeShow(false)
  }


  return (
    codeShow ?

      <ClickAwayListener onClickAway={close}>
        <Grid container
          sm={5}
          className={`${classes.codeFlyoutContainer}`}
        >
          <Fade in={true}>
            <div className={classes.root}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4">Source & Code</Typography>
                <BoxLabels />

                <IconButton aria-label="close" className={classes.mlAuto} onClick={close} >
                  <CloseIcon style={{ color: 'black', cursor: 'pointer' }} />
                </IconButton>
              </div>
              <AppBar
                position="static"
                // className={`${classes.maxHeight50}`}
                style={{ backgroundColor: "white", color: "#418CDD", borderTop: "none" }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="icon position tabs example"
                >
                  {tabs.map((item, index) => {
                    //not cooperating right now
                    // let labelToUse = item.props.src ?
                    //   <>
                    //     {item.label}
                    //     <Link href={item.props.src} target="_blank" rel="noopener noreferrer" >
                    //       <OpenInNewIcon />
                    //     </Link> </> : item.label;
                    return (
                      <Tab
                        label={item.label}
                        key={validIdHelper(`${item.label} - tab - index`)}
                        {...a11yProps(index)}
                      />

                      // <Tab icon={<PhoneIcon />} label="top" />

                    )
                  })}
                </Tabs>

              </AppBar>
              {tabs.map((item, index) => {
                const ComponentToRender = item.component;
                return (
                  <TabPanel
                    key={validIdHelper(`${item.label} -tabpanel - index`)}
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
    <div style={{ backgroundColor: "white", paddingLeft: "1.5rem", overflow: "auto" }}>
      <SyntaxHighlighter
        language="json"
        style={{ backgroundColor: "white" }}
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
      id={`simple - tabpanel - ${index} `}
      aria-labelledby={`simple - tab - ${index} `}
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
    id: `simple - tab - ${index} `,
    'aria-controls': `simple - tabpanel - ${index} `,
  };
}

function BoxLabels() {
  return (<div style={{ display: "flex", alignItems: "center", gridGap: ".5rem", marginLeft: "1rem" }}>
    <APISquare />
    <Typography style={{ fontWeight: 600 }}>API</Typography>
    <EmbedSquare />
    <Typography style={{ fontWeight: 600 }}>Embed</Typography>
  </div>)
}

function APISquare() {
  return <Square bg={API_BACKGROUND_COLOR} border={API_COLOR} />;
}

function EmbedSquare() {
  return <Square bg={EMBED_BACKGROUND_COLOR} border={EMBED_COLOR} />;
}

function Square({ bg, border }) {
  return <div style={{
    display: "inline",
    width: "18px",
    height: "18px",
    backgroundColor: bg,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: border,
  }}></div>
}