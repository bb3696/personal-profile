import React, { useState } from "react";
import { useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoCentroid, geoAlbersUsa } from "d3-geo";
import { Annotation } from "react-simple-maps";
import SearchToggleBar from "../components/SearchToggleBar";
import { STATE_ABBR, DEFAULT_VISITED_STATES } from "../data/stateList";
import StatesPrintView from "../components/StatesPrintView";
import TopNav from "../components/TopNav";
import "../css/USMap.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const USMap = () => {
  const [selected, setSelected] = useState(() => {
    const stored = localStorage.getItem("visitedStates");
    return stored ? JSON.parse(stored) : [];
  });

  const [searchText, setSearchText] = useState("");
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const projection = geoAlbersUsa(); // ✅ 提前创建一次
  const [geoList, setGeoList] = useState(null);
  const initializedDefaults = React.useRef(false);

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

  // 当地理数据可用时，将 DEFAULT_VISITED_STATES 合并到已选列表（去重），保留用户已有选择
  useEffect(() => {
    if (!geoList) return;
    if (!Array.isArray(DEFAULT_VISITED_STATES) || DEFAULT_VISITED_STATES.length === 0) return;
    if (initializedDefaults.current) return;

    const matches = [];
    geoList.forEach((geo) => {
      const name = geo.properties.name;
      const abbr = STATE_ABBR[name];
      const gid = geo.id;
      DEFAULT_VISITED_STATES.forEach((def) => {
        if (
          def === name ||
          def === abbr ||
          def === gid ||
          def === String(gid) ||
          Number(def) === gid
        ) {
          if (!matches.includes(gid)) matches.push(gid);
        }
      });
    });

    if (matches.length > 0) {
      const existing = Array.isArray(selected) ? selected.slice() : [];
      const merged = Array.from(new Set([...existing, ...matches]));
      setSelected(merged);
      localStorage.setItem("visitedStates", JSON.stringify(merged));
    }
    initializedDefaults.current = true;
  }, [geoList, selected]);

  const [showPrintView, setShowPrintView] = useState(false);

  const clearVisited = () => {
    setSelected([]);
    setShowVisitedOnly(false);
    localStorage.setItem("visitedStates", JSON.stringify([]));
  };

  const handlePrint = () => {
    setShowPrintView(true);
    // 等待地图数据加载和 DOM 渲染完成
    setTimeout(() => {
      window.print();
    }, geoList ? 300 : 1000);
  };

  const handleClosePrint = () => {
    setShowPrintView(false);
  };

  // 获取已访问的州名列表（用于打印）
  const getVisitedStateNames = () => {
    if (!geoList || selected.length === 0) return [];
    return geoList
      .filter((geo) => selected.includes(geo.id))
      .map((geo) => geo.properties.name)
      .filter(Boolean);
  };

  return (
    <div className="usmap-container">
      {showPrintView && (
        <div className="print-modal">
          <div className="print-modal-content">
            <button type="button" className="print-close-btn no-print" onClick={handleClosePrint}>×</button>
            <StatesPrintView 
              visitedStateNames={getVisitedStateNames()} 
              selectedIds={selected}
              geoList={geoList}
            />
          </div>
        </div>
      )}

      <div className={`usmap-page-chrome ${showPrintView ? 'no-print' : ''}`}>
        <TopNav />
        <h1 className="usmap-title">
          US States I've Visited
          <span className="visited-count">({selected.length} / 50)</span>
        </h1>

        <SearchToggleBar
          searchText={searchText}
          setSearchText={setSearchText}
          showVisitedOnly={showVisitedOnly}
          setShowVisitedOnly={setShowVisitedOnly}
          placeholder="Search states..."
          onClear={clearVisited}
          onPrint={handlePrint}
        />
      </div>

      <div className={`usmap-map-wrapper ${showPrintView ? 'no-print' : ''}`}>
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              // cache geographies once for default initialization (schedule update to avoid setState during render)
              if (geoList === null) setTimeout(() => setGeoList(geographies), 0);
              return geographies
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
                        className={`state-default ${isHighlighted ? "state-selected" : ""
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
            }}
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default USMap;
