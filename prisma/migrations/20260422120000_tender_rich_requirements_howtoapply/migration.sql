-- Rich HTML requirements + "How to apply" copy for tender detail pages.
ALTER TABLE "Tender" ADD COLUMN "requirementsHtml" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Tender" ADD COLUMN "howToApply" TEXT NOT NULL DEFAULT '';
