# Villa Zuri

**Villa Zuri** is a premium, single-property luxury booking platform designed to offer a seamless and visually immersive experience for guests seeking a private coastal escape.


## 🌟 Key Features

### Frontend Experience
- **Mobile-First Design**: Fully responsive layout starting from mobile optimization to expansive desktop split-views.
- **Luxury Aesthetic**: Deep ocean blues (`#0A2342`), crisp whites, and gold accents combined with elegant Serif typography (*Playfair Display*).
- **Immersive Interactions**: Smooth scroll behavior (`RevealOnScroll` animations) and full-screen visual overlays.
- **Custom Navigation**: Minimalist "3-line" hamburger menu with a full-screen luxury overlay for a distraction-free interface.

### Booking Engine (Internal Logic)
The platform includes a robust booking algorithm (`src/utils/bookingLogic.js`) featuring:
- **Seasonal Dynamic Pricing**:
  - **Peak Season (Oct - Jan)**: $600/night
  - **Off-Peak (Feb - Sept)**: $400/night
- **Availability Management**: Collision detection to prevent double bookings.
- **Validation**: Strict date validation (no past dates, invalid ranges).

## 🚀 Tech Stack
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (CSS Variables for theming, no frameworks)
- **Icons**: Custom CSS & Lucide React

## 🛠️ Getting Started

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
3.  **Run Booking Logic Tests**:
    ```bash
    node src/utils/testBooking.js
    ```
