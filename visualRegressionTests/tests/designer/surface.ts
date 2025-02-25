import { ClientFunction, Selector } from "testcafe";
import { url, setJSON, takeElementScreenshot, addQuestionByAddQuestionButton, wrapVisualTest } from "../../helper";

const title = "Designer surface";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {
});

test("Check section", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 1080);

    const surveyJSON = {
      "showQuestionNumbers": "off",
      "widthMode": "static",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              title: "Question 1",
            },
            {
              "type": "text",
              "name": "question2",
              title: "Question 2",
              startWithNewLine: false,
            },
          ]
        }
      ]
    };

    await setJSON(surveyJSON);
    await takeElementScreenshot("questions-in-one-row.png", Selector(".svc-row .sd-row"), t, comparer);
  });
});

test("Test question type converter", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 1080);

    const surveyJSON = {
      "showQuestionNumbers": "off",
      "widthMode": "static",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              title: "Question 1",
            }
          ]
        }
      ]
    };
    await setJSON(surveyJSON);

    await t
      .click(Selector(".svc-question__content"), { offsetX: 5, offsetY: 5 })
      .expect(Selector("#convertTo").visible).ok()
      .click(Selector("#convertTo"))
      .expect(Selector(".sv-popup__container").filterVisible().visible).ok();
    await takeElementScreenshot("convert-to-popup.png", Selector(".sv-popup__container").filterVisible(), t, comparer);
  });
});

test("Test question type selector", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 1080);

    const surveyJSON = {
      "showQuestionNumbers": "off",
      "widthMode": "static",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              title: "Question 1",
            }
          ]
        }
      ]
    };
    await setJSON(surveyJSON);

    await t
      .click(Selector(".svc-page__content--new .svc-page__question-type-selector-icon"))
      .expect(Selector(".sv-popup__container").filterVisible().visible).ok();
    await takeElementScreenshot("select-type-popup.png", Selector(".sv-popup__container").filterVisible(), t, comparer);
  });
});

test("Matrix column editor", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 900);
    await addQuestionByAddQuestionButton(t, "Multiple-Choice Matrix");
    const row1Column1Cell = Selector(".sd-table__row").nth(0).find(".svc-matrix-cell").filterVisible().nth(1);
    const editColumnButton = Selector(".svc-matrix-cell__question-controls-button").filterVisible();

    const showControl = ClientFunction(() => {
      const el: any = document.querySelectorAll("td:nth-of-type(2) .svc-matrix-cell .svc-matrix-cell__question-controls")[0];
      el.style.display = "block";
    });

    await t
      .expect(Selector(".svc-question__content").exists).ok()
      .hover(row1Column1Cell, { speed: 0.5 });

    // TODO: remove this line after TestCafe implements workig hover
    await showControl();

    await t.click(editColumnButton);

    await takeElementScreenshot("matrix-cell-edit.png", Selector(".svc-matrix-cell__popup .sv-popup__container"), t, comparer);
  });
});

test("Choices (Checkbox): Layout", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(2560, 1440);

    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              "type": "checkbox",
              "name": "question1",
              "choices": [
                "Item 1",
                "Item 2"
              ],
              "hasOther": true,
              "colCount": 2
            }
          ]
        }
      ]
    };
    await setJSON(json);

    const QRoot = Selector(".svc-question__adorner").filterVisible();
    await takeElementScreenshot("surface-checkbox-layout.png", QRoot, t, comparer);
  });
});

test("Placeholder", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1767, 900);
    const designerTabContent = Selector(".svc-tab-designer");
    await ClientFunction(() => {
      (<any>window).creator.toolbox.isCompact = true;
    })();

    await takeElementScreenshot("surface-placeholder.png", designerTabContent, t, comparer);
  });
});

test("Placeholder with survey header", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1767, 900);
    const designerTabContent = Selector(".svc-tab-designer");
    await ClientFunction(() => {
      (<any>window).creator.toolbox.isCompact = true;
      (<any>window).creator.showHeaderInEmptySurvey = true;
    })();

    await takeElementScreenshot("surface-placeholder-with-header.png", designerTabContent, t, comparer);
  });
});

test("Page and question borders", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1767, 900);
    const json = {
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ]
        }
      ]
    };
    await setJSON(json);
    await ClientFunction(() => {
      (<any>window).creator.toolbox.isCompact = true;
    })();
    const designerTabContent = Selector(".svc-tab-designer");
    const pageContent = Selector(".svc-page__content:not(.svc-page__content--new)");
    const qContent = Selector(".svc-question__content");
    await takeElementScreenshot("page-content.png", designerTabContent, t, comparer);
    await takeElementScreenshot("question-content.png", pageContent, t, comparer);
    await t.hover(pageContent, { offsetX: 5, offsetY: 5 }).wait(300);
    await takeElementScreenshot("page-content-hover.png", designerTabContent, t, comparer);
    await t.hover(qContent, { offsetX: 5, offsetY: 5 }).wait(300);
    await takeElementScreenshot("question-content-hover.png", pageContent, t, comparer);
    await t.hover(pageContent.find(".svc-page__add-new-question"));
    await takeElementScreenshot("question-add-hover.png", pageContent, t, comparer);
    await t.click(qContent, { offsetX: 5, offsetY: 5 });
    await takeElementScreenshot("question-content-click.png", pageContent, t, comparer);
    await t.click(pageContent, { offsetX: 5, offsetY: 5 });
    await takeElementScreenshot("page-content-click.png", designerTabContent, t, comparer);
    await t.click(pageContent.find(".sd-page__title"), { offsetX: 5, offsetY: 5 });
    await takeElementScreenshot("page-title-click.png", designerTabContent, t, comparer);

  });
});

test("Question borders in panels", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1767, 1500);
    const json = {
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  "type": "panel",
                  "name": "panel2",
                  "elements": [
                    {
                      "type": "text",
                      "name": "question7"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    await setJSON(json);
    await ClientFunction(() => {
      (<any>window).creator.toolbox.isCompact = true;
    })();

    const qContent = Selector("[data-name=question7]");
    const pageContent = Selector(".svc-page__content:not(.svc-page__content--new)");
    await t.hover(qContent, { offsetX: 5, offsetY: 5 }).wait(300);
    await takeElementScreenshot("question-panel-content-hover.png", pageContent, t, comparer);
  });
});

/*
  test("Check question width and position", async (t) => { 
  await wrapVisualTest(t, async (t, comparer) => { 
    await t.resizeWindow(1920, 1080);
  
    const surveyJSON = {
      "showQuestionNumbers": "off",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              title: "Question 1",
            },
          ]
        }
      ]
    };
  
    await setJSON(surveyJSON);
    await takeElementScreenshot("question-in-center", Selector(".svc-tab-designer"), t, comparer);
  }); });
  */
test("Panel empty", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 900);
    const json = {
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "panel",
              "name": "panel1",
            }
          ]
        }
      ]
    };
    await setJSON(json);
    await takeElementScreenshot("surface-empty-panel.png", Selector(".svc-question__content"), t, comparer);
    await t.hover(Selector(".svc-question__content div").withText("Add Question"));
    await takeElementScreenshot("surface-empty-panel-hover.png", Selector(".svc-question__content"), t, comparer);
  });
});

test("Panel not empty", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 900);
    const json = {
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  "type": "text",
                  "name": "question1"
                }
              ]
            }
          ]
        }
      ]
    };
    await setJSON(json);
    await takeElementScreenshot("surface-not-empty-panel.png", Selector(".svc-question__content"), t, comparer);
    await t.hover(Selector(".svc-question__content div").withText("Add Question"));
    await takeElementScreenshot("surface-not-empty-panel-hover.png", Selector(".svc-question__content"), t, comparer);
  });
});

test("Panel gap between items", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 900);
    const json = {
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  "type": "text",
                  "name": "question1"
                },
                {
                  "type": "text",
                  "name": "question2"
                }
              ]
            }
          ]
        }
      ]
    };
    await setJSON(json);
    await takeElementScreenshot("surface-panel.png", Selector(".svc-question__content"), t, comparer);
  });
});

test("Panel multi-question row", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 900);
    const json = {
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  "type": "text",
                  "name": "question1"
                },
                {
                  "type": "text",
                  "name": "question2",
                  "startWithNewLine": false
                }
              ]
            }
          ]
        }
      ]
    };
    await setJSON(json);
    await takeElementScreenshot("surface-panel-multi-row.png", Selector(".svc-question__content"), t, comparer);

    const Question1 = Selector(
      "[data-sv-drop-target-survey-element=\"question1\"]"
    );
    const Question2 = Selector(
      "[data-sv-drop-target-survey-element=\"question2\"]"
    );
    const DragZoneQuestion1 = Question1.find(".svc-question__drag-element");

    await t.click(Question1, { speed: 0.1, offsetY: 20 });
    await t.hover(DragZoneQuestion1, { speed: 0.1 });
    await t.dragToElement(DragZoneQuestion1, Question2, {
      offsetX: 5,
      offsetY: 5,
      destinationOffsetX: -80,
      speed: 0.5
    });

    await takeElementScreenshot("surface-panel-multi-row-question-selected.png", Selector(".svc-question__content"), t, comparer);
  });
});

test("Matrix dynamic with detail", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 900);
    const json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }],
          width: "800px"
        },
      ],
    };
    await setJSON(json);
    await takeElementScreenshot("surface-matrix-detail.png", Selector(".svc-question__content"), t, comparer);
  });
});

test("Matrix dynamic with detail empty", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 900);
    const json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          width: "800px"
        },
      ],
    };
    await setJSON(json);
    await takeElementScreenshot("surface-matrix-detail-empty.png", Selector(".svc-question__content"), t, comparer);
  });
});

test("Matrix check title editing (https://github.com/surveyjs/survey-creator/issues/3160)", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 900);
    const json = {
      elements: [
        {
          "type": "matrix",
          "name": "question1",
          "columns": [
            "Column 1",
            "Column 2",
            "Column 3"
          ],
          "rows": [
            "Row 1",
            "Row 2"
          ],
          width: "800px"
        },
      ],
    };
    await setJSON(json);
    await ClientFunction(() => { (<HTMLElement>document.querySelector("[data-name='question1'] .sv-string-editor")).focus(); })();
    await takeElementScreenshot("surface-matrix-title-editing.png", Selector(".svc-question__content"), t, comparer);
  });
});

test("Matrix dynamic with detail two questions + select", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 1900);
    const json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
          width: "800px"
        },
      ],
    };
    await setJSON(json);
    await t.click(Selector(".sd-table__cell--detail-panel .svc-row").nth(0), { offsetX: -5, offsetY: -5 })
      .expect(Selector(".svc-question__content--selected").visible).ok();
    await takeElementScreenshot("surface-matrix-detail-two-questions-select.png", Selector(".svc-question__content"), t, comparer);
  });
});
test("Logo image hover", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 1900);
    const json = {
      elements: [
        {
          type: "text",
          name: "q1"
        },
      ],
    };
    await setJSON(json);
    await t.hover(".svc-logo-image");
    await takeElementScreenshot("logo-image-hover.png", Selector(".svc-logo-image"), t, comparer);
  });
});

test("Logo image adorners", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1920, 1900);
    const json = {
      logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
      elements: [
        {
          type: "text",
          name: "q1"
        },
      ],
    };
    await setJSON(json);
    await takeElementScreenshot("logo-image-adorners.png", Selector(".svc-logo-image"), t, comparer);
  });
});

test("Check survey layout in mobile mode", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(550, 900);
    const designerTabContent = Selector(".svc-tab-designer");
    await setJSON({
      "title": "Survey title",
      "description": "Survey description",
      "showQuestionNumbers": "off",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question11"
            },
            {
              "type": "matrix",
              "name": "question1",
              "columns": [
                "Column 1",
                "Column 2",
              ],
              "rows": [
                "Row 1",
                "Row 2"
              ]
            }
          ],
        }
      ]
    });
    await takeElementScreenshot("designer-survey-layout-mobile.png", designerTabContent, t, comparer);
  });
});

test("Check property grid flyout", async (t) => {
  await wrapVisualTest(t, async (t, comparer) => {
    await t.resizeWindow(1120, 900);
    const root = Selector(".svc-creator");
    await setJSON({});
    await t.click(Selector("button[title='Survey Settings']"));
    await takeElementScreenshot("propery-grid-flyout.png", root, t, comparer);
  });
});