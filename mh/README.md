# Mental Health Prediction: Next.js frontend

Frontend for the existing FastAPI backend (`POST /predict`). The backend and model are untouched.

## Run

```bash
# 1. backend (in your FastAPI folder, as before)
uvicorn main:app --reload

# 2. frontend (in this folder)
npm install
npm run dev          # http://localhost:3000
```

The backend URL lives in `.env.local` (one place only, read in `lib/api.ts`):

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Before a demo, run `npm run typecheck` and `npm run build` once.

## Structure

```
app/            layout, page, global styles
components/     Navbar, Hero, AssessmentForm, FormSection, ProgressIndicator,
                ResultCard, DayBar, Disclaimer, About, Footer
components/fields/  NumberField, SliderField, ChoiceCards, CountrySelect, FieldShell
lib/            api.ts (fetch + friendly errors), validation.ts (mirrors Pydantic), countries.ts
types/          prediction.ts (StudentData, PredictionResponse, allowed values)
```

## Notes

- Field names and allowed values mirror `StudentData` in `main.py` exactly.
- "USA" and "UK" use the backend's spelling so the model groups them correctly; other countries become "Other" server-side.
- No ML preprocessing in the browser. No localStorage, cookies, or analytics.
- The score range is not defined anywhere in the project, so the result is shown as a plain number.
