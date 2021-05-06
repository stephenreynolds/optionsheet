export enum TradeType {
  ShortCallVertical,
  ShortPutVertical,
  LongCallVertical,
  LongPutVertical,
  ShortStrangle,
  LongStrangle,
  ShortStraddle,
  LongStraddle,
  ShortCall,
  ShortPut,
  LongCall,
  LongPut,
  IronCondor,
  ReverseIronCondor,
  ShortCoveredCall,
  ShortCoveredPut,
  LongCoveredCall,
  LongCoveredPut,
  ShortCallButterfly,
  ShortPutButterfly,
  LongCallButterfly,
  LongPutButterfly,
  JadeLizard,
  ReverseJadeLizard,
  LongPutCalendar,
  LongCallCalendar,
  ShortStock,
  LongStock
}

export enum OptionType {
  Call,
  Put
}

export enum Side {
  Long,
  Short
}