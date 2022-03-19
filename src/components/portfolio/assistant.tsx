import { Container } from "../styles";
import { useState } from "react";
import { usd } from "../../common/tradeUtils";
import { DirectionalBias, getStrategySuggestions, RiskOn } from "./strategySuggestions";
import styled from "styled-components";

const LeverageButton = styled.button`
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`;

const getTargetDelta = (spy: number, netLiq: number, direction: DirectionalBias, targetTheta: number, multiplier: number) => {
  switch (direction) {
    case DirectionalBias.Bullish:
      return Math.floor(multiplier * netLiq / spy);
    case DirectionalBias.Bearish:
      return Math.ceil(multiplier * -targetTheta / 2);
    case DirectionalBias.Neutral:
      return 0;
  }
};

const getTargetTheta = (netLiq: number, riskOn: RiskOn) => {
  switch (riskOn) {
    case RiskOn.On:
      return Math.floor(netLiq * 0.005);
    case RiskOn.Off:
      return Math.floor(netLiq * 0.001);
    case RiskOn.Neutral:
      return Math.floor(netLiq * 0.0025);
  }
};

const getRisk = (netLiq: number, risk: number) => {
  return netLiq * risk / 100;
};

const StrategyAssistant = () => {
  const [netLiq, setNetLiq] = useState("");
  const [spy, setSPY] = useState("");
  const [direction, setDirection] = useState(DirectionalBias.Bullish);
  const [multiplier, setMultiplier] = useState(1);
  const [riskOn, setRiskOn] = useState(RiskOn.Off);
  const [riskPerTrade, setRiskPerTrade] = useState("");
  const [currentDelta, setCurrentDelta] = useState("");
  const [currentTheta, setCurrentTheta] = useState("");

  const onNetLiqChange = (e) => {
    setNetLiq(e.target.value);
  };

  const onSPYChange = (e) => {
    setSPY(e.target.value);
  };

  const onDirectionChange = (e) => {
    setDirection(e.target.value);
  };

  const toggleLeveraged = () => {
    if (multiplier === 1) {
      setMultiplier(2);
    }
    else if (multiplier === 2) {
      setMultiplier(0.5);
    }
    else {
      setMultiplier(1);
    }
  };

  const onRiskOnChange = (e) => {
    setRiskOn(e.target.value);
  };

  const onRiskPerTradeChange = (e) => {
    setRiskPerTrade(e.target.value);
  };

  const onCurrentDeltaChange = (e) => {
    setCurrentDelta(e.target.value);
  };

  const onCurrentThetaChange = (e) => {
    setCurrentTheta(e.target.value);
  };

  const targetTheta = getTargetTheta(Number(netLiq), riskOn);
  const targetDelta = getTargetDelta(Number(spy), Number(netLiq), direction, targetTheta, multiplier);
  const risk = getRisk(Number(netLiq), Number(riskPerTrade));
  const filteredStrategies = getStrategySuggestions(
    Number(currentDelta), Number(currentTheta), Number(targetDelta), Number(targetTheta), false);

  const showGoals = Number(netLiq) > 0 && Number(spy) > 0 && Number(riskPerTrade) > 0;
  const showSuggestions = showGoals && currentDelta.length > 0 && currentTheta.length > 0;

  return (
    <Container>
      <h1>Strategy Assistant</h1>
      <p>
        A systematic method choosing strategies for your options portfolio.
      </p>

      <br />

      {/* Current portfolio statistics and risk preferences */}
      <h2>Current Portfolio Statistics</h2>
      <div className="d-flex space-between">
        <div>
          <label>Net Liquidity</label>
          <input type="text" className="mx-0" value={netLiq} onChange={onNetLiqChange} />
        </div>
        <div>
          <label>SPY</label>
          <input type="text" className="mx-0" value={spy} onChange={onSPYChange} />
        </div>
        <div>
          <label>Market Direction</label>
          <select value={direction} onChange={onDirectionChange}>
            {Object.keys(DirectionalBias).map((key) =>
              <option key={key} value={key}>{DirectionalBias[key]}</option>
            )}
          </select>
          <LeverageButton onClick={toggleLeveraged}>x{multiplier}</LeverageButton>
        </div>
        <div>
          <label>Risk On or Risk Off</label>
          <select value={riskOn} onChange={onRiskOnChange}>
            {Object.keys(RiskOn).map((key) =>
              <option key={key} value={RiskOn[key]}>{RiskOn[key]}</option>
            )}
          </select>
        </div>
        <div>
          <label>Risk per trade %</label>
          <input type="text" value={riskPerTrade} onChange={onRiskPerTradeChange} />
        </div>
      </div>

      {/* Calculated goals */}
      {showGoals ? (
        <>
          <br />
          <h2>Portfolio Goals</h2>
          <div className="d-flex space-between columns">
            <div>
              <h2>Delta: {targetDelta} &Delta; {targetDelta === 0 ? `±${Math.floor(Number(netLiq) * 0.001)}` : ""}</h2>
              <label className="ml-0">
                Current &Delta;:
                <input type="text" value={currentDelta} onChange={onCurrentDeltaChange} />
              </label>
            </div>

            <div>
              <h2>Theta: {targetTheta} &Theta;</h2>
              <label className="ml-0">
                Current &Theta;:
                <input type="text" value={currentTheta} onChange={onCurrentThetaChange} />
              </label>
            </div>

            <div>
              <h2>Risk: {usd.format(risk)}</h2>
            </div>
          </div>
        </>
      ) : <p>Complete the above inputs to calculate goals.</p>}

      {/* Strategy suggestions */}
      {showSuggestions ? (
        <>
          <br />
          <h2>Suggested Strategies</h2>
          <div>
            {filteredStrategies.map((strategy, key) => (
              <div key={key}>
                <h3>{strategy.name}</h3>
              </div>
            ))}
          </div>

          <small>
            Note:<br />
            These suggestions assume the chosen underlying is positively correlated with the S&P 500.
            Check the beta-weighted delta of individual trades before placing them.
          </small>
        </>
      ) : showGoals && <p>Complete the above inputs to get suggestions.</p>}
    </Container>
  );
};

export default StrategyAssistant;