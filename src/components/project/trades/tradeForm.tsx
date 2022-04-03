import { useState, MouseEvent, FormEvent } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Trade, TradeCreateModel, TradeUpdateModel } from "../../../common/models/trade";
import { tradeIsOption } from "../../../common/tradeUtils";
import DateInput from "../../shared/dateInput";
import Modal from "../../shared/modal";
import TagInput from "../../shared/tagInput";
import { Container } from "../../styles";
import LegInputGroup from "./legInputGroup";
import {
  closeDateIsValid,
  initialLegValues,
  legStrikesAreValid,
  onAddLegClick,
  onNoteChange,
  onStrategyChange,
  onSymbolChange,
  onTradeDateChange,
  StrategyOptions,
  symbolIsValid
} from "./tradeInputUtils";
import { addTrade, updateTradeById } from "../../../common/api/trades";
import _ from "lodash";

const FormContainer = styled(Container)`
  width: fit-content;

  form {
    input {
      width: 7em;
      margin-bottom: 8px;
    }

    button {
      margin-bottom: 8px;
    }

    .react-date-picker--disabled {
      background: none;
      opacity: 0.5;
    }

    .react-date-picker__wrapper {
      input {
        margin: 0;
      }

      button {
        margin: 0;
      }
    }

    .legs {
      width: fit-content;
    }
  }
`;

interface Props {
  username?: string;
  projectName?: string;
  trades: Trade[];
  trade?: Trade;
  close?: boolean;
  show: boolean;
  toggleVisibility: () => void;
}

const getAllTradeTags = (trades: Trade[]) => {
  return _.uniq(trades
    .map((trade) => trade.tags)
    .flat());
};

const TradeForm = ({ username, projectName, trades, trade, close, show, toggleVisibility }: Props) => {
  if (!show) {
    return null;
  }

  const initialValues = {
    symbol: trade ? trade.symbol : "",
    open_date: trade ? trade.open_date : new Date(),
    close_date: () => {
      if (trade) {
        if (trade.close_date) {
          return trade.close_date;
        }
        if (trade.open_date) {
          return trade.open_date;
        }
      }
      return undefined;
    },
    legs: trade ? trade.legs : [initialLegValues],
    opening_note: trade && trade.opening_note ? trade.opening_note : "",
    closing_note: trade && trade.closing_note ? trade.closing_note : "",
    tags: trade ? trade.tags : [],
    strategy: StrategyOptions.Call,
    errorMessages: []
  };

  const [symbol, setSymbol] = useState(initialValues.symbol);
  const [openDate, setOpenDate] = useState(initialValues.open_date);
  const [closeDate, setCloseDate] = useState(initialValues.close_date);
  const [legs, setLegs] = useState(initialValues.legs);
  const [openingNote, setOpeningNote] = useState(initialValues.opening_note);
  const [closingNote, setClosingNote] = useState(initialValues.closing_note);
  const [tags, setTags] = useState(initialValues.tags);
  const [strategy, setStrategy] = useState(initialValues.strategy);
  const [errorMessages, setErrorMessages] = useState(initialValues.errorMessages);

  const clear = () => {
    setSymbol(initialValues.symbol);
    setOpenDate(initialValues.open_date);
    setCloseDate(initialValues.close_date);
    setLegs(initialValues.legs);
    setOpeningNote(initialValues.opening_note);
    setClosingNote(initialValues.closing_note);
    setTags(initialValues.tags);
    setStrategy(StrategyOptions.Call);
    setErrorMessages([]);
  };

  const inputsValid = (): boolean => {
    let messages = [];

    if (!symbolIsValid(symbol)) {
      const m = "Symbol is invalid.";
      messages = [...messages, m];
    }

    if (!(isShares || legStrikesAreValid(legs))) {
      const m = "Strikes are invalid.";
      messages = [...messages, m];
    }

    if (trade && trade.close_date) {
      if (!closeDateIsValid(openDate, closeDate)) {
        const m = "Close date must be after open date.";
        messages = [...messages, m];
      }
    }

    if (messages.length > 0) {
      setErrorMessages([...messages]);
      return false;
    }

    return true;
  };

  const closeTrade = (id: string) => {
    const updatedTrade: TradeUpdateModel = {
      symbol,
      open_date: openDate,
      close_date: closeDate,
      legs,
      opening_note: openingNote,
      closing_note: closingNote,
      tags
    };

    updateTradeById(id, updatedTrade)
      .then(() => {
        toast.success("Edited trade.");
        toggleVisibility();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const editTrade = (id: string) => {
    const updatedTrade: TradeUpdateModel = {
      symbol,
      open_date: openDate,
      close_date: trade.close_date ? closeDate : null,
      legs,
      opening_note: openingNote,
      closing_note: trade.closing_note ? closingNote : null,
      tags
    };

    updateTradeById(id, updatedTrade)
      .then(() => {
        toast.success("Edited trade.");
        toggleVisibility();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const createTrade = () => {
    const newTrade: TradeCreateModel = {
      symbol,
      open_date: openDate,
      legs,
      opening_note: openingNote,
      tags
    };

    addTrade(username, projectName, newTrade)
      .then(async () => {
        toast.success("Trade added.");
        clear();
        toggleVisibility();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!inputsValid()) {
      return;
    }

    if (trade) {
      const { id } = useParams<{ id: string; }>();

      if (close) {
        closeTrade(id);
      }
      else {
        editTrade(id);
      }
    }
    else {
      createTrade();
    }
  };

  const onCancel = (e: MouseEvent) => {
    e.preventDefault();
    clear();
    toggleVisibility();
  };

  const isShares = strategy === StrategyOptions.Shares || trade && !tradeIsOption(trade.legs);
  const tagSuggestions = getAllTradeTags(trades);

  return (
    <Modal toggleVisibility={toggleVisibility}>
      <div className="modal-heading">
        {close ? <h3>Close trade</h3> : <h3>Edit trade</h3>}
      </div>
      <FormContainer className="modal-content">
        <form>
          <div className="d-flex">
            {/* Symbol */}
            <div>
              <label>Symbol</label>
              <input type="text" placeholder="XYZ" value={symbol} onChange={(e) => onSymbolChange(e, setSymbol)}
                     disabled={close} />
            </div>

            {/* Open date */}
            {!close && (
              <div>
                <label>Open date</label>
                <DateInput value={openDate} onChange={(e) => onTradeDateChange(e, setOpenDate)} clearIcon={null} />
              </div>
            )}

            {/* Strategy */}
            {!trade && (
              <div>
                <label>Strategy</label>
                <select value={strategy} onChange={(e) => onStrategyChange(e, setStrategy, setLegs, openDate)}>
                  {Object.keys(StrategyOptions).map((strategy) => (
                    <option key={strategy} value={strategy}>{StrategyOptions[strategy]}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Close date */}
            {trade && (close || trade.close_date) && (
              <div>
                <label>Close date</label>
                <DateInput value={closeDate} onChange={(e) => onTradeDateChange(e, setCloseDate)} clearIcon={null} />
              </div>
            )}
          </div>

          {/* Legs */}
          <div className="legs">
            {legs.map((leg, i) => <LegInputGroup key={i} index={i} legs={legs} setLegs={setLegs}
                                                 isShares={isShares} isClosing={close}
                                                 isClosed={trade && !!trade.close_date} />)}
          </div>

          {/* Add leg button */}
          {!(close || isShares) && (
            <div>
              <button onClick={(e) => onAddLegClick(e, legs, setLegs)} disabled={legs.length === 4}>Add leg</button>
            </div>
          )}

          {/* Tags */}
          <div>
            <label>Tags</label>
            <TagInput tags={tags} setTags={setTags} suggestions={tagSuggestions} />
          </div>

          {/* Opening notes */}
          {!close && (
            <div>
              <label>Opening note</label>
              <textarea rows={1} value={openingNote} onChange={(e) => onNoteChange(e, setOpeningNote)} />
            </div>
          )}

          {/* Closing notes */}
          {trade && (close || trade.close_date) && (
            <div>
              <label>Closing note</label>
              <textarea rows={1} value={closingNote} onChange={(e) => onNoteChange(e, setClosingNote)} />
            </div>
          )}

          {errorMessages.length > 0 && (
            <div>
              <ul>
                {errorMessages.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit and clear buttons */}
          <div>
            <button onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-green" onClick={onSubmit}>Submit</button>
          </div>
        </form>
      </FormContainer>
    </Modal>
  );
};

export default TradeForm;