import { makeAutoObservable } from 'mobx';

export default class SettingsStore {

    error: string = ''
    idSettingsNumber: string = '41'
    constructor() {
        makeAutoObservable(this);
    }
    // 'short_answer' == Короткий ответ
//  'true_false' == ДА / НЕТ
//  'single_choice' == Одиночный выбор
//  'multiple_choice' == Множественный выбор
//  'descriptive' == Описательный
//  'survey' == Опрос

    questionsObj = [
        {
            "id": 1,
            "body": "<p>Which ingredients are required for the <em>Tonno e cipolla </em>pizza?</p>",
            "bodyAbstract": "Which ingredients are required for the Tonno e cipolla pizza?",
            "position": 1,
            "required": false,
            "questionType": "SINGLE_ANSWER",
            "questionsCount": 7,
            "maxScore": 1,
            "reviewable": false,
            "subjects": [
                {
                    "id": "IBXzcOmuruibpLwKcawL1PabkLrJJt6vgMCZXQrfg3z_-eHmvZ0Ma8W6S947Ddx29A",
                    "name": "Product knowledge"
                }
            ],
            "tags": [
                {
                    "ordinalNumber": 2,
                    "label": "Product knowledge"
                }
            ],
            "answerConfiguration": {
                "answers": [
                    {
                        "id": "IGZ6hagfDcSoopsJnHPQ1PJs1zXUiFWOQk-gKC3RPg-lQ6eDZ8ac0wqdTIqZc5jD0w",
                        "body": "<p>Mozzarella, Tuna, Onion seasoned with Oregano, Basil, Salt, Pepper with a splash of Extra Virgin Olive Oil </p>",
                        "readonly": true,
                        "score": null,
                        "correct": true
                    },
                    {
                        "id": "IFcBd5X7JQxOFHLtmCQbPKaK8YHgvzie3SB96WFFozoHpZOwVcCYIu-57RYpgr0PNQ",
                        "body": "<p>Mozzarella, Tomato Sauce, Spicy Salami, Oregano</p>",
                        "readonly": true,
                        "score": null,
                        "correct": false
                    },
                    {
                        "id": "IObP8LDgAsDSALIo3Gol4By_HhJp1h_EZyCJlRnIcGotwjT54LCjuKBzzV1IQ_BOzA",
                        "body": "<p>Mozzarella, Tomato Puree, Cooked Ham, Boiled Eggs, Mushrooms, Artichokes, Pitted Black Olives, Oregano, Basil</p>",
                        "readonly": true,
                        "score": null,
                        "correct": false
                    }
                ]
            }
        },
        {
            "id": 2,
            "body": "<p>What type of pizza is this? </p>\r\n<p><img alt='' width='434' height='336' src='https://images.testportal.net/eyJidWNrZXQiOiJ0ZXN0cG9ydGFsLXBsLWFzc2V0cyIsImtleSI6Ik5neWUtZW50RV8xcDRaQzJZWERvV2cvOWZmZTliNzg2ZDMwNzc4YzE3MzA0ZDI4ZmQ4OGZkNmVkNTkzOTQ5MzU3MGM3NjEzYzcwNGFiN2ZlMWE1OGFjNyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6NjkyLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9fX0&#61;' /></p>",
            "bodyAbstract": "What type of pizza is this? &hellip;",
            "position": 2,
            "required": false,
            "questionType": "SINGLE_ANSWER",
            "questionsCount": 7,
            "maxScore": 1,
            "reviewable": false,
            "subjects": [
                {
                    "id": "IBXzcOmuruibpLwKcawL1PabkLrJJt6vgMCZXQrfg3z_-eHmvZ0Ma8W6S947Ddx29A",
                    "name": "Product knowledge"
                }
            ],
            "tags": [
                {
                    "ordinalNumber": 2,
                    "label": "Product knowledge"
                }
            ],
            "answerConfiguration": {
                "answers": [
                    {
                        "id": "IOgsRAChqj9RnjwGfjkCBmNSR75ekJjsf71rKu54H_cuXCGjTiwPifngeT1OGBk3aA",
                        "body": "<p>Margherita</p>",
                        "readonly": true,
                        "score": null,
                        "correct": true
                    },
                    {
                        "id": "IFhLYcF_2mYyWb6pVk3a6SrsYQOc30cQDZYWPDG6nqRg_EJVekMOuV96NmB4efkLdQ",
                        "body": "<p>Tonno e cipolla</p>",
                        "readonly": true,
                        "score": null,
                        "correct": false
                    },
                    {
                        "id": "INVuPKWgoN0dRdV8BAXQdYoKotgISEYV-fc7LjAQrHoMsEY6jKbZFw2qbsu1YE_ntw",
                        "body": "<p>Salame</p>",
                        "readonly": true,
                        "score": null,
                        "correct": false
                    }
                ]
            }
        },
        {
            "id": 3,
            "body": "<p>What type of tomato do we use for our tomato sauce?</p>",
            "bodyAbstract": "What type of tomato do we use for our tomato sauce?",
            "position": 3,
            "required": false,
            "questionType": "SINGLE_ANSWER",
            "questionsCount": 7,
            "maxScore": 1,
            "reviewable": false,
            "subjects": [
                {
                    "id": "IBXzcOmuruibpLwKcawL1PabkLrJJt6vgMCZXQrfg3z_-eHmvZ0Ma8W6S947Ddx29A",
                    "name": "Product knowledge"
                }
            ],
            "tags": [
                {
                    "ordinalNumber": 2,
                    "label": "Product knowledge"
                }
            ],
            "answerConfiguration": {
                "answers": [
                    {
                        "id": "ICp6hoG_u5kX-uAjQM96c5TrTrrt50mSK0zvAEQF-JXNcLpMsNIaQuGZmICEaO5hTQ",
                        "body": "<p>San Marzano</p>\r\n<p><img alt='' width='242' height='242' src='https://assets.testportal.net/---manual-upload/static-images/Example%20Test%20for%20Restaurant%20Staff%20-%20Q3%20-%20San%20Marzano.jpeg' /></p>",
                        "readonly": true,
                        "score": null,
                        "correct": true
                    },
                    {
                        "id": "IFWiKea4FuygBZGrLZUAi0hD54zi2G7ZGSnD2T5ZwxVJNJCY_qF2yta_JWilyV8l2g",
                        "body": "<p>Cocktail tomato</p>\r\n<p><img alt='' width='329' height='219' src='https://assets.testportal.net/---manual-upload/static-images/Example%20Test%20for%20Restaurant%20Staff%20-%20Q3%20-%20Coctail%20Tomato.jpeg'  /></p>",
                        "readonly": true,
                        "score": null,
                        "correct": false
                    },
                    {
                        "id": "IPtrjbLkvjqFEms83BmHBUro2c-QVLT7YUQ6howgZK8y52XgLE1nrr0ygJA4O70uBA",
                        "body": "<p>Beefsteak tomato</p>\r\n<p><img alt='' width='333' height='222' src='https://assets.testportal.net/---manual-upload/static-images/Example%20Test%20for%20Restaurant%20Staff%20-Q3-Beefsteak%20tomato.jpg'   /></p>",
                        "readonly": true,
                        "score": null,
                        "correct": false
                    }
                ]
            }
        },
        {
            "id": 4,
            "body": "<p>What are the ingredients of the <strong>pizza of the month</strong>?</p>",
            "bodyAbstract": "What are the ingredients of the pizza of the month?",
            "position": 4,
            "required": false,
            "questionType": "DESCRIPTIVE",
            "questionsCount": 7,
            "maxScore": 1,
            "reviewable": true,
            "subjects": [
                {
                    "id": "IFSHu3-w8oOtjNE0oa3hfLhUKvJk0gCoMReMWPuM3zZ3Q54al7aqOm_QDL_iWetwJQ",
                    "name": "Restaurant knowledge"
                }
            ],
            "tags": [
                {
                    "ordinalNumber": 1,
                    "label": "Restaurant knowledge"
                }
            ],
            "answerConfiguration": {
                "maxWordsCount": 200
            }
        },
        {
            "id": 5,
            "body": "<p>What is the name of the <strong>pizza of the month</strong>?</p>",
            "bodyAbstract": "What is the name of the pizza of the month?",
            "position": 5,
            "required": false,
            "questionType": "SHORT_ANSWER",
            "questionsCount": 7,
            "maxScore": 1,
            "reviewable": true,
            "subjects": [
                {
                    "id": "IFSHu3-w8oOtjNE0oa3hfLhUKvJk0gCoMReMWPuM3zZ3Q54al7aqOm_QDL_iWetwJQ",
                    "name": "Restaurant knowledge"
                }
            ],
            "tags": [
                {
                    "ordinalNumber": 1,
                    "label": "Restaurant knowledge"
                }
            ],
            "answerConfiguration": {
                "possibleAnswers": [
                    {
                        "id": "IMOVvSrVcT47lXNuCxg6QaR2tXSEOdFl4Y1ogNXHMXSD53Q8IDFvuDIrFzHvjnKyGQ",
                        "answerText": "Hawaii",
                        "score": 1
                    },
                    {
                        "id": "ILpXSU3YLzDsmOIsVjjpcae7_BtDJIIm2M3o-RsAnk5w72BL2KOwej1iUrLdBsDtfw",
                        "answerText": "hawaii",
                        "score": 1
                    },
                    {
                        "id": "IOOl1jKz3btKf8qCG1zGSTOsTAaAjgzlE_YiZyT3SMTfVHpQ_TMm9S8yRPXE9tVwhw",
                        "answerText": "pizza Hawaii",
                        "score": 1
                    },
                    {
                        "id": "IAd1TQE5pa2C5IeoiwTWto8CqINBHpcbyQiaR-evybf7ombvVCyyTuqX2wzMIUHMcw",
                        "answerText": "pizza hawaii",
                        "score": 1
                    }
                ],
                "maxAnswersCount": 1
            }
        },
        {
            "id": 6,
            "body": "<p>Does the Neapolitan pizza dough consist of wheat flour?</p>",
            "bodyAbstract": "Does the Neapolitan pizza dough consist of wheat flour?",
            "position": 6,
            "required": false,
            "questionType": "TRUE_FALSE",
            "questionsCount": 7,
            "maxScore": 1,
            "reviewable": false,
            "subjects": [
                {
                    "id": "IBXzcOmuruibpLwKcawL1PabkLrJJt6vgMCZXQrfg3z_-eHmvZ0Ma8W6S947Ddx29A",
                    "name": "Product knowledge"
                }
            ],
            "tags": [
                {
                    "ordinalNumber": 2,
                    "label": "Product knowledge"
                }
            ],
            "answerConfiguration": {
                "answers": [
                    {
                        "id": "IO3G6--7w_IdYYJmONMVju5q4VCAibCqULhOl5g0xbnmK9ohTl9xo4Z37A_TjJ_ekA",
                        "body": "<p>True</p>",
                        "readonly": true,
                        "score": null,
                        "correct": true
                    },
                    {
                        "id": "IC_uUX5vZrqrRglrbU07A4ftJORbhixJWVh1FcUP-v5LDLoHyPmRlr6sWet1R33kPg",
                        "body": "<p>False</p>",
                        "readonly": true,
                        "score": null,
                        "correct": false
                    }
                ]
            }
        },
        {
            "id": 7,
            "body": "<p>Select all ingredients of the original Neapolitan pizza </p>",
            "bodyAbstract": "Select all ingredients of the original Neapolitan pizza ",
            "position": 7,
            "required": false,
            "questionType": "MULTI_ANSWER",
            "questionsCount": 7,
            "maxScore": 1,
            "reviewable": false,
            "subjects": [
                {
                    "id": "IBXzcOmuruibpLwKcawL1PabkLrJJt6vgMCZXQrfg3z_-eHmvZ0Ma8W6S947Ddx29A",
                    "name": "Product knowledge"
                }
            ],
            "tags": [
                {
                    "ordinalNumber": 2,
                    "label": "Product knowledge"
                }
            ],
            "answerConfiguration": {
                "answers": [
                    {
                        "id": "IIUg7-2kISnwwmt6Zi_7NVOSJzbWqVZE8gLxJYQ45h_88DjDR7OGDczXV4HcWSsViw",
                        "body": "<p>San Marzano tomatoes</p>",
                        "readonly": true,
                        "score": null,
                        "correct": true
                    },
                    {
                        "id": "IEu1t4qvAYHpNjTV6Z5pVto7XdfCwJsqLDey0E9hZWhCvHAe3TbnAmj1UR2veKyUiw",
                        "body": "<p>Mozzarella di Bufala Campana</p>",
                        "readonly": true,
                        "score": null,
                        "correct": true
                    },
                    {
                        "id": "IP4YUXODvK_gjRR2Wsd7NpIV1SU9Gv5vMSjI_9_1OH7lhTAjQ1tMf3PTKRy5Gpigrg",
                        "body": "<p>Wheat flour</p>",
                        "readonly": true,
                        "score": null,
                        "correct": true
                    },
                    {
                        "id": "IPOvby0aC9mOCLkvuhwYLrORIhpJursBXiQqL8wqxRWDjd6U01GCJYqTodeL3HF6Rw",
                        "body": "<p>Mushrooms</p>",
                        "readonly": true,
                        "score": null,
                        "correct": false
                    }
                ]
            }
        }
    ]
// 'short_answer' == Короткий ответ
//  'true_false' == ДА / НЕТ
//  'single_choice' == Одиночный выбор
//  'multiple_choice' == Множественный выбор
//  'descriptive' == Описательный
//  'survey' == Опрос

    setIdSettingsNumber = (value: string) => {
        this.idSettingsNumber = value
    }


}
