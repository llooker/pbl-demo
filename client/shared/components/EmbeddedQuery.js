import $ from "jquery";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { Typography, Grid, Card } from "@material-ui/core";
import { ApiHighlight, EmbedHighlight } from "./Accessories/Highlight";
import { appContextMap, validIdHelper } from "../utils/tools";
import { Loader } from "./Accessories";
import DownArrow from "../images/down_arrow_solid.svg";
import UpArrow from "../images/up_arrow_solid.svg";

export function EmbeddedQuery({ lookerContentItem, classes, id }) {
  const [iFrameExists, setIFrame] = useState(0);
  const [explore, setExplore] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { clientSession, isReady, corsApiCall } = useContext(
    appContextMap[process.env.REACT_APP_PACKAGE_NAME]
  );
  const { lookerUser } = clientSession;

  // needed to copy from home to make it work
  useEffect(() => {
    let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(
      0,
      clientSession.lookerBaseUrl.lastIndexOf(":")
    );
    LookerEmbedSDK.init(modifiedBaseUrl, "/auth");
  }, []);

  useEffect(() => {
    if (isReady) {
      corsApiCall(fetchData);
    }
  }, [lookerUser, isReady]);

  // update the map when new item is selected
  useEffect(() => {
    if (!explore) return;
    if (!lookerContentItem.categoryFilter) return;

    explore.updateFilters({ "products.category": selectedItem });
    explore.run();
  }, [selectedItem, explore]);

  const onSelect = useCallback(
    (selectedItem) => setSelectedItem(selectedItem),
    [setSelectedItem]
  );

  const idToUse = validIdHelper(
    `embedContainer-${lookerContentItem.type}-${lookerContentItem.id}`
  );
  const fetchData = async () => {
    $(`#${idToUse}`).html("");
    setIFrame(0);

    let queryUrl = encodeURIComponent(
      `${lookerContentItem.queryUrl}${document.location.origin}`
    );
    await fetch(`/auth?src=${queryUrl}`)
      .then((response) => response.json())
      .then((data) => {
        LookerEmbedSDK.createExploreWithUrl(data.url)
          .appendTo(document.getElementById(idToUse))
          .withClassName("explore")
          .withClassName("splashPage")
          .withClassName(lookerContentItem.id)
          .withClassName(`${classes.w100}`)
          .withTheme("atom_fashion")
          .build()
          .connect()
          .then((explore) => {
            setExplore(explore);
            setIFrame(1);
            let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(
              0,
              clientSession.lookerBaseUrl.lastIndexOf(":")
            );
            LookerEmbedSDK.init(modifiedBaseUrl);
          })
          .catch((error) => {
            console.log("catch", error);
          });
      })
      .then(() => {
        setIFrame(1);
      });
  };

  return (
    <Card
      className={`${classes.padding15} ${classes.overflowHidden}`}
      elevation={0}
    >
      <Loader
        hide={iFrameExists}
        classes={classes}
        height={lookerContentItem}
      />

      <div
        className={`${classes.overflowYScroll}`}
        style={{ height: lookerContentItem.height }}
      >
        <Grid container spacing={0}>
          <Grid
            container
            spacing={0}
            
          >
            {lookerContentItem.categoryFilter && (
              <CategoryFilter
                lookerContentItem={lookerContentItem}
                onSelect={onSelect}
                classes={classes}
              />
            )}
            <Grid item sm={12}>
              <EmbedHighlight classes={classes}>
                <div
                  className={`embedContainer embedContainerNoHeader splashPage 
                 ${classes.overflowHidden} ${classes.maxHeight80Percent}`}
                  id={idToUse}
                  key={idToUse}
                ></div>
              </EmbedHighlight>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
}

function CategoryFilter({ lookerContentItem, onSelect, classes }) {
  const { query, sortValue, key, label, image, change } =
    lookerContentItem.categoryFilter;
  const { sdk } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);

  const [selectedItem, setSelectedItem] = useState(null);

  const [data, setData] = useState(null);
  const [sorted, setSorted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    sdk
      .run_inline_query(query)
      .then((data) => {
        setLoading(false);
        setData(data.value);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [setLoading, setData, setError]);

  useEffect(() => {
    if (!data) return;
    const sorted = data
      .slice()
      .sort((a, b) =>
        sortOrder === "asc"
          ? sortValue(a) - sortValue(b)
          : sortValue(b) - sortValue(a)
      );
    setSorted(sorted);
    if (!selectedItem) setSelectedItem(key(sorted[0]));
  }, [sortOrder, data, setSorted, selectedItem, setSelectedItem]);

  useEffect(() => onSelect(selectedItem), [selectedItem]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", paddingBottom:"2rem", width:"100%" }}>
        <Typography variant="h6" style={{textTransform:"uppercase", fontWeight:600}}>
          Regional Weekly Performance by Category
        </Typography>
        <SortOrderButton
          onClick={() => setSortOrder("desc")}
          selected={sortOrder === "desc"}
          classes={classes}
        >
          High to Low
        </SortOrderButton>{" "}
        {" / "}
        <SortOrderButton
          onClick={() => setSortOrder("asc")}
          selected={sortOrder === "asc"}
          classes={classes}
        >
          Low to High
        </SortOrderButton>
      </div>
      {!loading && !error && sorted && (
        <ApiHighlight classes={classes}>
          <div
            style={{
              display: "flex",
              overflow: "auto",
              // I'm fighting with the combination material ui grids + overflow custom categoryItemFilters. This needs an absolute width, because otherwise the items will overflow and cause the page to appear wider than it is. I'm sure there's some flexbox magic that I can do somehwere in this component or higher up, but this looks good enough on a standard 13inch screen with 100% zoom, can take this on later. 
              maxWidth: "1000px",
            }}
          >
            {sorted.map((d) => (
              <CategoryFilterItem
                key={key(d)}
                onClick={() => setSelectedItem(key(d))}
                isSelected={key(d) === selectedItem}
                label={label(d)}
                change={change(d)}
                image={image(d)}
                classes={classes}
              />
            ))}
          </div>
        </ApiHighlight>
      )}
    </>
  );
}
function CategoryFilterItem(props) {
  const { onClick, isSelected, change, label, image, classes } = props;
  const [hover, setHover] = useState(false);
  const showArrow = hover || isSelected;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: ".1rem 1.25rem",
      }}
    >
      <div
        className={classes.categoryfilteritem}
        style={{
          backgroundImage: `url(${image})`,
          border: isSelected ? "4px solid #70aafa" : "1px solid #C4C4C4",
        }}
      >
        {showArrow && (
          <>
            <img
              src={change >= 0 ? UpArrow : DownArrow}
              style={{
                marginTop: "25px",
                height: "60px",
              }}
            />
            <div className={classes.categoryfilteritemChange}>
              {Math.round(change)}%
            </div>
          </>
        )}
      </div>
      <div style={{ textAlign: "center", fontWeight:"550" }}>{label}</div>
    </div>
  );
}

function SortOrderButton({ onClick, selected, children, classes }) {
  return (
    <button
      onClick={onClick}
      className={classes.sortorderbutton}
      style={{ color: selected ? "#418CDD" : "#777777" }}
    >
      {children}
    </button>
  );
}
