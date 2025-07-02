import React, { useState } from "react";
import { useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoCentroid, geoAlbersUsa } from "d3-geo";
import { Annotation } from "react-simple-maps";
import SearchToggleBar from "../components/SearchToggleBar";
import { Link } from "react-router-dom";
import STATE_ABBR from "../data/stateList";
import "../css/USMap.css"; // 引入样式文件

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const USMap = () => {
  const [selected, setSelected] = useState(() => {
    const stored = localStorage.getItem("visitedStates");
    return stored ? JSON.parse(stored) : [];
  });

  const [searchText, setSearchText] = useState("");
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const projection = geoAlbersUsa(); // ✅ 提前创建一次

  useEffect(() => {
    localStorage.setItem("visitedStates", JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const angle = Math.round(x * 360);
      document.body.style.background = `linear-gradient(${angle}deg, #0d1a26, #1f3b4d)`;
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="usmap-container">
      <h1 className="usmap-title">
        US States I've Visited
        <span className="visited-count">({selected.length} / 50)</span>
      </h1>

      <div className="home">
        <Link className="park-link" to="/">
          Home
        </Link>
      </div>

      <SearchToggleBar
        searchText={searchText}
        setSearchText={setSearchText}
        showVisitedOnly={showVisitedOnly}
        setShowVisitedOnly={setShowVisitedOnly}
        placeholder="Search states..." // 👈 这里改提示文字
      />
      <div className="usmap-map-wrapper">
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter((geo) => {
                  if (showVisitedOnly) {
                    return selected.includes(geo.id);
                  }
                  return true;
                })
                .map((geo) => {
                  const stateName = geo.properties.name;
                  const isSelected = selected.includes(geo.id);
                  const isSearchMatched =
                    searchText.trim() !== "" &&
                    stateName.toLowerCase().includes(searchText.toLowerCase());
                  const isHighlighted = isSelected || isSearchMatched;
                  const centroid = geoCentroid(geo.geometry);
                  const isValidCentroid =
                    Array.isArray(centroid) &&
                    centroid.length === 2 &&
                    !centroid.includes(undefined);
                  const screenCoord = isValidCentroid
                    ? projection(centroid)
                    : null;

                  return (
                    <React.Fragment key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        onClick={() =>
                          setSelected((prev) =>
                            prev.includes(geo.id)
                              ? prev.filter((id) => id !== geo.id)
                              : [...prev, geo.id]
                          )
                        }
                        stroke="#fff"
                        className={`state-default ${
                          isHighlighted ? "state-selected" : ""
                        }`}
                        style={{
                          default: {
                            outline: "none",
                            cursor: "pointer",
                            opacity: isHighlighted ? 1 : 0.4,
                          },
                          hover: { outline: "none", cursor: "pointer" },
                          pressed: { outline: "none" },
                        }}
                      />
                      {screenCoord && (
                        <Annotation
                          subject={centroid}
                          dx={0}
                          dy={0}
                          connectorProps={{ stroke: "none" }}
                        >
                          <text
                            className="statename"
                            x={0}
                            y={0}
                            textAnchor="middle"
                            fontSize={10}
                          >
                            {STATE_ABBR[stateName] || stateName}
                          </text>
                        </Annotation>
                      )}
                    </React.Fragment>
                  );
                })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default USMap;
