// Shared UI primitives — local implementations (no design-system npm package).
// All tokens from design-system-vikki-used-tokens.txt are applied via CSS variables
// declared in index.css.

import React from 'react';

// ---- Text ----------------------------------------------------------------
export type TextVariant =
  | 'title-1'
  | 'title-2'
  | 'headline'
  | 'body'
  | 'body-semibold'
  | 'footnote'
  | 'caption-2'
  | 'mono-label';

const TEXT_CLASS: Record<TextVariant, string> = {
  'title-1': 'text-title-1',
  'title-2': 'text-title-2',
  'headline': 'text-headline',
  'body': 'text-body',
  'body-semibold': 'text-body-semibold',
  'footnote': 'text-footnote',
  'caption-2': 'text-caption-2',
  'mono-label': 'text-mono-label',
};

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  semantic?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  'data-testid'?: string;
  id?: string;
}

export function Text({ variant = 'body', children, semantic, className, ...rest }: TextProps) {
  const cls = `${TEXT_CLASS[variant]} ${className ?? ''}`.trim();
  if (semantic && /^h[1-6]$/.test(semantic)) {
    const Tag = semantic as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    return <Tag className={cls} {...rest}>{children}</Tag>;
  }
  return <span className={cls} {...rest}>{children}</span>;
}

// ---- Button ----------------------------------------------------------------
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
  loading?: boolean;
  'data-testid'?: string;
}

export function Button({ variant = 'primary', children, loading, className, disabled, ...rest }: ButtonProps) {
  const base = 'btn';
  const variantCls = `btn-${variant}`;
  return (
    <button
      className={`${base} ${variantCls} ${className ?? ''}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? '\u0110ang x\u1EED l\u00FD...' : children}
    </button>
  );
}

// ---- SegmentedControl -------------------------------------------------------
interface SegmentOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  'data-testid'?: string;
}

export function SegmentedControl({ options, value, onChange, ariaLabel, ...rest }: SegmentedControlProps) {
  return (
    <div className="segmented-control" role="group" aria-label={ariaLabel} {...rest}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`segmented-option ${value === opt.value ? 'segmented-option--active' : ''}`}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ---- TextField ---------------------------------------------------------------
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  'data-testid'?: string;
}

export function TextField({ label, error, id, className, ...rest }: TextFieldProps) {
  const inputId = id ?? `field-${label?.replace(/\s+/g, '-').toLowerCase() ?? 'input'}`;
  return (
    <div className="text-field">
      {label && (
        <label htmlFor={inputId} className="text-field__label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`text-field__input ${error ? 'text-field__input--error' : ''} ${className ?? ''}`.trim()}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${inputId}-error`} className="text-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

// ---- Checkbox ---------------------------------------------------------------
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  'data-testid'?: string;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onChange, ariaLabel, disabled, ...rest }: CheckboxProps) {
  const id = `chk-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        aria-label={ariaLabel}
        disabled={disabled}
        {...rest}
      />
      <span className="checkbox__label">{label}</span>
    </label>
  );
}

// ---- Radio ---------------------------------------------------------------
interface RadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  ariaLabel?: string;
  'data-testid'?: string;
}

export function Radio({ name, value, checked, onChange, label, ariaLabel, ...rest }: RadioProps) {
  const id = `radio-${name}-${value}`;
  return (
    <label className="radio" htmlFor={id}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        aria-label={ariaLabel}
        className="radio__input"
        {...rest}
      />
      <span className="radio__label">{label}</span>
    </label>
  );
}

// ---- Divider ---------------------------------------------------------------
export function Divider() {
  return <hr className="divider" aria-hidden="true" />;
}

// ---- InlineError ---------------------------------------------------------------
interface InlineErrorProps {
  visible: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
}

export function InlineError({ visible, children, ...rest }: InlineErrorProps) {
  if (!visible) return null;
  return (
    <span className="inline-error" role="alert" {...rest}>
      {children}
    </span>
  );
}

// ---- AlertNote ---------------------------------------------------------------
interface AlertNoteProps {
  visible: boolean;
  children: React.ReactNode;
  tone?: 'neutral' | 'warning' | 'error' | 'success';
  'data-testid'?: string;
}

export function AlertNote({ visible, children, tone = 'neutral', ...rest }: AlertNoteProps) {
  if (!visible) return null;
  return (
    <div className={`alert-note alert-note--${tone}`} role="alert" {...rest}>
      {children}
    </div>
  );
}

// ---- ServiceTile ---------------------------------------------------------------
interface ServiceTileProps {
  label: string;
  icon: string;
  enabled: boolean;
  badge?: string;
  ariaLabel?: string;
  onClick?: () => void;
  selected?: boolean;
  'data-testid'?: string;
}

const ICON_EMOJI: Record<string, string> = {
  'airplane-seat': '\uD83D\uDCBA',
  'utensils': '\uD83C\uDF74',
  'luggage': '\uD83E\uDDF3',
  'shield': '\uD83D\uDEE1\uFE0F',
  'shopping-bag': '\uD83D\uDECD\uFE0F',
  'gift': '\uD83C\uDF81',
  'building': '\uD83C\uDFE8',
  'activity': '\u26BD',
  'car': '\uD83D\uDE97',
};

export function ServiceTile({ label, icon, enabled, badge, ariaLabel, onClick, selected, ...rest }: ServiceTileProps) {
  return (
    <button
      type="button"
      className={`service-tile ${!enabled ? 'service-tile--disabled' : ''} ${selected ? 'service-tile--selected' : ''}`}
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      aria-label={ariaLabel ?? label}
      aria-pressed={selected}
      {...rest}
    >
      <span className="service-tile__icon" aria-hidden="true">{ICON_EMOJI[icon] ?? '\u2B50'}</span>
      <span className="service-tile__label">{label}</span>
      {badge && <span className="service-tile__badge">{badge}</span>}
    </button>
  );
}

// ---- ResultIcon ---------------------------------------------------------------
interface ResultIconProps {
  state: 'success' | 'failed' | 'partial' | 'simulated';
  'data-testid'?: string;
}

export function ResultIcon({ state, ...rest }: ResultIconProps) {
  const map = {
    success: { bg: 'var(--color-success)', symbol: '\u2713', label: 'Th\u00E0nh c\u00F4ng' },
    simulated: { bg: 'var(--color-success)', symbol: '\u2713', label: 'Th\u00E0nh c\u00F4ng (m\u00F4 ph\u1ECFng)' },
    failed: { bg: 'var(--color-error)', symbol: '\u2715', label: 'Th\u1EA5t b\u1EA1i' },
    partial: { bg: 'var(--color-warning)', symbol: '\u26A0', label: 'M\u1ED9t ph\u1EA7n' },
  };
  const { bg, symbol, label } = map[state];
  return (
    <div
      className="result-icon"
      style={{ background: bg }}
      aria-label={label}
      role="img"
      {...rest}
    >
      <span aria-hidden="true">{symbol}</span>
    </div>
  );
}

// ---- PaymentMethodRail ---------------------------------------------------------------
export function PaymentMethodRail({ 'data-testid': testId }: { 'data-testid'?: string }) {
  return (
    <div className="payment-method-rail" data-testid={testId}>
      <span className="payment-method-rail__label">
        Ph\u01B0\u01A1ng th\u1EE9c thanh to\u00E1n s\u1EBD đ\u01B0\u1EE3c ch\u1ECDn qua Vikki Pay
      </span>
    </div>
  );
}

// ---- Calendar ---------------------------------------------------------------
interface CalendarProps {
  month: number;
  year: number;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  dailyPrices?: Record<string, number>;
  'data-testid'?: string;
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function Calendar({ month, year, selectedDate, onSelectDate, dailyPrices, ...rest }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells: Array<{ day: number | null; dateStr: string | null }> = [];
  for (let i = 0; i < startDow; i++) cells.push({ day: null, dateStr: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr });
  }

  return (
    <div className="calendar" {...rest}>
      <div className="calendar__weekdays">
        {WEEKDAYS.map(w => (
          <span key={w} className="calendar__weekday">{w}</span>
        ))}
      </div>
      <div className="calendar__grid">
        {cells.map((cell, idx) => {
          if (!cell.day || !cell.dateStr) {
            return <span key={idx} className="calendar__cell calendar__cell--empty" />;
          }
          const cellDate = new Date(year, month - 1, cell.day);
          const isPast = cellDate < today;
          const isSelected = cell.dateStr === selectedDate;
          const price = dailyPrices?.[cell.dateStr];
          return (
            <button
              key={cell.dateStr}
              type="button"
              className={`calendar__cell ${isSelected ? 'calendar__cell--selected' : ''} ${isPast ? 'calendar__cell--past' : ''}`}
              disabled={isPast}
              onClick={() => !isPast && onSelectDate?.(cell.dateStr!)}
              aria-label={`${cell.day} th\u00E1ng ${month} ${year}${price ? ', t\u1EEB ' + price.toLocaleString('vi-VN') + ' VND' : ''}`}
              aria-pressed={isSelected}
            >
              <span className="calendar__day">{cell.day}</span>
              {price && <span className="calendar__price">{(price / 1000000).toFixed(1)}M</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- SeatMap ---------------------------------------------------------------
import type { SeatInfo } from '../types';

interface SeatMapProps {
  seats: SeatInfo[];
  selectedSeats: Record<number, string>; // passengerIndex -> seatNumber
  activePassengerIndex: number;
  onSelectSeat: (seat: SeatInfo, passengerIndex: number) => void;
  'data-testid'?: string;
}

const ZONE_ORDER: SeatInfo['zone'][] = ['Front', 'Premium', 'Standard', 'Relax'];
const ZONE_LABEL: Record<SeatInfo['zone'], string> = {
  Front: 'Ph\u00EDa tr\u01B0\u1EDBc',
  Premium: 'Premium',
  Standard: 'Ti\u00EAu chu\u1EA9n',
  Relax: 'Relax',
};

export function SeatMap({ seats, selectedSeats, activePassengerIndex, onSelectSeat, ...rest }: SeatMapProps) {
  const byZone: Record<string, SeatInfo[]> = {};
  for (const seat of seats) {
    if (!byZone[seat.zone]) byZone[seat.zone] = [];
    byZone[seat.zone].push(seat);
  }

  const selectedSeatNumbers = new Set(Object.values(selectedSeats));

  return (
    <div className="seat-map" {...rest}>
      {ZONE_ORDER.filter(z => byZone[z]?.length).map(zone => (
        <div key={zone} className="seat-map__zone">
          <p className="seat-map__zone-label">{ZONE_LABEL[zone]}</p>
          <div className="seat-map__seats">
            {byZone[zone].map(seat => {
              const isUnavailable = !seat.available;
              const isNullPrice = seat.priceAmount === null;
              const isSelected = selectedSeatNumbers.has(seat.seatNumber);
              const isMySelection = selectedSeats[activePassengerIndex] === seat.seatNumber;
              const isDisabled = isUnavailable || isNullPrice;
              return (
                <button
                  key={seat.seatNumber}
                  type="button"
                  className={`seat ${
                    isDisabled ? 'seat--disabled' : ''
                  } ${isSelected ? (isMySelection ? 'seat--mine' : 'seat--taken') : ''}`}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onSelectSeat(seat, activePassengerIndex)}
                  aria-label={`Gh\u1EBF ${seat.seatNumber}${seat.priceAmount ? ', ' + seat.priceAmount.toLocaleString('vi-VN') + ' VND' : ''}${isUnavailable ? ', kh\u00F4ng c\u00F3 s\u1EB5n' : ''}`}
                  aria-pressed={isMySelection}
                >
                  {isUnavailable ? '\u00D7' : seat.seatNumber}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
