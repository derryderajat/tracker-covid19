import "./App.css";
import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./utils";
import LineGraph from "./LineGraph";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <BrowserRouter>
      <div className="app">
        {/* Header */}
        <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 TRACKER</h1>

            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                onChange={onCountryChange}
                value={country}
              >
                {/* Looping all the countries */}

                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Title */}
          <div className="app__stats">
            {console.log(countryInfo)}
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              active={casesType === "cases"}
              title="Coronavirus Cases"
              total={prettyPrintStat(countryInfo.cases)}
              cases={prettyPrintStat(countryInfo.todayCases)}
            />
            <InfoBox
              casesType={casesType}
              onClick={(e) => setCasesType("recovered")}
              active={casesType === "recovered"}
              title="Recovered"
              total={prettyPrintStat(countryInfo.recovered)}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
            />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              active={casesType === "deaths"}
              title="Deaths"
              total={prettyPrintStat(countryInfo.deaths)}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
            />
          </div>

          {/* Map */}
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

        <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new cases</h3>
            <LineGraph casesType="cases" />
          </CardContent>
        </Card>
      </div>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
