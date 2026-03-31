import React from 'react'
import { formatPrice } from '../utilities/priceCalculator'
import { getCarAppearance, isBlockedCombination } from '../utilities/carAppearance'
import '../css/CarPreview.css'

const CarPreview = ({ selections = [], totalPrice, compact = false }) => {
  const appearance = getCarAppearance(selections)
  const blocked = isBlockedCombination(selections)

  return (
    <section className={`car-preview-panel ${compact ? 'compact' : ''}`}>
      <div
        className="car-preview-stage"
        style={{ background: appearance.stageBackground }}
      >
        <div
          className="car-preview-glow"
          style={{ background: appearance.bodyHighlight }}
        />
        <div className="car-preview-road" />

        <div
          className="car-shell"
          style={{
            background: `linear-gradient(180deg, ${appearance.bodyHighlight} 0%, ${appearance.bodyColor} 58%, #1f2330 100%)`,
          }}
        >
          <div className="car-window-strip">
            <div className="car-window" />
            <div className="car-window rear" />
          </div>

          <div className="car-cabin">
            <div
              className="car-seat back"
              style={{ background: appearance.seatColor }}
            />
            <div
              className="car-seat front"
              style={{ background: appearance.seatColor }}
            />
            <div
              className="car-dashboard"
              style={{ background: appearance.trimColor }}
            />
          </div>

          <div className="car-door-line" />
          <div
            className={`car-engine-aura ${appearance.isElectric ? 'electric' : ''} ${appearance.isTurbo ? 'turbo' : ''}`}
            style={{ background: appearance.engineAccent }}
          />
          <div className="car-headlight" />
          <div className="car-tail-light" />
          <div
            className="car-engine-badge"
            style={{ background: appearance.engineAccent }}
          >
            {appearance.engineBadge}
          </div>
        </div>

        <div className="car-wheel-track">
          <div
            className={`car-wheel ${appearance.wheelClass}`}
            style={{
              '--wheel-accent': appearance.wheelAccent,
              '--wheel-trim': appearance.wheelTrim,
            }}
          >
            <span className="car-wheel-core" />
            <span className="car-wheel-spokes" />
          </div>
          <div
            className={`car-wheel ${appearance.wheelClass}`}
            style={{
              '--wheel-accent': appearance.wheelAccent,
              '--wheel-trim': appearance.wheelTrim,
            }}
          >
            <span className="car-wheel-core" />
            <span className="car-wheel-spokes" />
          </div>
        </div>
      </div>

      <div className="car-preview-summary">
        <div className="car-preview-price">
          <span>Total Build Price</span>
          <strong>{formatPrice(totalPrice ?? 0)}</strong>
        </div>

        <div className="car-preview-metrics">
          <div>
            <span>Exterior</span>
            <strong>{appearance.exteriorLabel}</strong>
          </div>
          <div>
            <span>Wheels</span>
            <strong>{appearance.wheelsLabel}</strong>
          </div>
          <div>
            <span>Interior</span>
            <strong>{appearance.interiorLabel}</strong>
          </div>
          <div>
            <span>Powertrain</span>
            <strong>{appearance.engineLabel}</strong>
          </div>
        </div>

        <p className="car-preview-copy">{appearance.engineDetail}</p>

        {blocked && (
          <p className="car-preview-warning">
            Electric drive and sport wheels cannot be paired in this build.
          </p>
        )}
      </div>
    </section>
  )
}

export default CarPreview
