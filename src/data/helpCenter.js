// SSI Help Center - Plain Language Guides
// Goal: Help people understand their rights and options

export const COMMON_PROBLEMS = [
  {
    id: 'overpayment',
    icon: '💸',
    title: 'I Got an Overpayment Notice',
    subtitle: 'SSA says I owe them money',
    urgent: true
  },
  {
    id: 'benefits-cut',
    icon: '📉',
    title: 'My Benefits Were Reduced',
    subtitle: 'My check is smaller than before'
  },
  {
    id: 'benefits-stopped',
    icon: '🚫',
    title: 'My Benefits Were Stopped',
    subtitle: "I'm not getting payments anymore",
    urgent: true
  },
  {
    id: 'asset-limit',
    icon: '🏦',
    title: 'I Have Too Much in Savings',
    subtitle: 'The $2,000 limit and what counts'
  },
  {
    id: 'working',
    icon: '💼',
    title: 'I Started Working',
    subtitle: 'How work affects my SSI'
  },
  {
    id: 'reporting',
    icon: '📝',
    title: 'What Do I Need to Report?',
    subtitle: 'Changes SSA needs to know about'
  }
];

export const HELP_CONTENT = {
  overpayment: {
    title: 'You Got an Overpayment Notice',
    intro: 'Getting a letter saying you owe Social Security thousands of dollars is terrifying. But you have options and you do not have to just accept it.',
    
    sections: [
      {
        title: 'First: Do Not Panic, Do Not Ignore It',
        content: 'The worst thing you can do is throw the letter away. You have rights, but there are deadlines. The most important deadline is 10 days from when you got the letter. If you appeal within 10 days, your benefits usually continue while you fight it.'
      },
      {
        title: 'You Have 3 Main Options',
        content: null,
        options: [
          {
            name: 'Ask Them to Forgive It (Waiver)',
            desc: 'If paying would cause you hardship AND the overpayment was not your fault, SSA can forgive part or all of what they say you owe. This is called a waiver.',
            form: 'SSA-632 (Request for Waiver)'
          },
          {
            name: 'Say It Is Wrong (Appeal)',
            desc: 'If you think SSA made a mistake with wrong dates, wrong amounts, or they did not count something correctly, you can appeal. Ask for reconsideration.',
            form: 'SSA-561 (Request for Reconsideration)'
          },
          {
            name: 'Ask for Lower Payments',
            desc: 'If you do owe the money but cannot afford the amount they want to take from your check, you can ask to pay less each month.',
            form: 'Call SSA or visit your local office'
          }
        ]
      },
      {
        title: 'What to Say When Asking for a Waiver',
        content: 'To get a waiver, you need to show two things:',
        bullets: [
          'It was not your fault. You did not know about the rule, you reported everything you were supposed to, or SSA gave you wrong information.',
          'Paying would hurt you. You need the money for rent, food, medicine, or other basic needs.'
        ]
      },
      {
        title: 'The $2,000 Asset Limit Trap',
        content: "Many overpayments happen because families did not know about the $2,000 asset limit ($3,000 for couples). This limit is on what the SSI recipient owns, including savings accounts in their name, even if a parent manages the money. If you went over this limit without knowing, that is a strong argument that it was not your fault for the waiver request."
      },
      {
        title: 'Important Deadlines',
        deadlines: [
          { days: '10 days', action: 'Appeal to keep benefits continuing while you fight' },
          { days: '60 days', action: 'Request reconsideration (appeal)' },
          { days: '60 days', action: 'Request waiver (no strict deadline, but sooner is better)' }
        ]
      }
    ],
    
    doThis: [
      'Write down the date you received the letter',
      'Make copies of everything before sending anything to SSA',
      'Request your file from SSA to see what they based this on',
      'Contact a free legal aid organization in your state',
      'If within 10 days, file that appeal TODAY'
    ],
    
    dontDoThis: [
      'Do not ignore the letter',
      'Do not assume you have to pay',
      'Do not agree to a payment plan until you have explored your options',
      'Do not feel ashamed. These rules are confusing and SSA makes mistakes'
    ]
  },

  'asset-limit': {
    title: 'The $2,000 Asset Limit',
    intro: 'One of the most common reasons people lose SSI or get overpayments is going over the asset limit without knowing it. Here is what you need to know.',
    
    sections: [
      {
        title: 'The Basic Rule',
        content: "If you get SSI, you cannot have more than $2,000 in countable resources ($3,000 if you are married to someone who also gets SSI). This limit has not changed since 1989. It is not adjusted for inflation."
      },
      {
        title: 'What Counts Against the Limit',
        bullets: [
          'Cash',
          'Bank accounts (checking, savings) in your name',
          'Stocks, bonds, investments',
          'A second car or vehicle',
          'Property you do not live in',
          'Life insurance policies worth over $1,500'
        ]
      },
      {
        title: 'What Does NOT Count',
        bullets: [
          'Your home (the one you live in)',
          'One car (regardless of value)',
          'Household goods and personal items',
          'Burial plots and up to $1,500 set aside for burial',
          'ABLE accounts (special savings accounts for people with disabilities)',
          'Back payments from SSI for 9 months after you get them'
        ]
      },
      {
        title: 'For Parents of Disabled Children',
        content: "If your child gets SSI, the $2,000 limit applies to assets in YOUR CHILD'S name. But be careful. Some of your assets might count too depending on your child's age and living situation. Money you put in a savings account for your child could disqualify them if it is in their name or a joint account.",
        warning: true
      },
      {
        title: 'What If You Are Over the Limit?',
        content: 'If you realize you are over $2,000, you have options:',
        bullets: [
          'Spend down on allowable things (rent, food, medical bills, repairs)',
          'Open an ABLE account and move money there (up to $100,000 does not count)',
          'Set up a Special Needs Trust (talk to a lawyer)',
          'Report it to SSA immediately. Being honest helps if there is ever an overpayment question'
        ]
      }
    ],
    
    doThis: [
      "Check all bank accounts that have your name (or your child's name) on them",
      'Look into ABLE accounts. They are a game changer',
      'Report any inheritance or gift immediately',
      'Keep records of what you spend money on'
    ],

    dontDoThis: [
      'Do not put savings for your disabled child in their name or a joint account',
      'Do not hide money. SSA can check bank records',
      'Do not forget about old accounts you might have'
    ]
  },

  'benefits-cut': {
    title: 'Your Benefits Were Reduced',
    intro: 'If your SSI check is suddenly smaller, there is a reason. But that does not mean the reason is correct. Here is how to find out what happened and what to do about it.',
    
    sections: [
      {
        title: 'Common Reasons for a Reduction',
        bullets: [
          'Your income went up (or SSA thinks it did)',
          'Someone in your household started working',
          'Your living situation changed',
          'You got another type of benefit (like SSDI)',
          'SSA recalculated based on information they received',
          'You turned 18 (different rules apply to adults)'
        ]
      },
      {
        title: 'How to Find Out Why',
        content: 'Call SSA at 1-800-772-1213 or visit your local office. Ask them to explain exactly why your payment changed. Ask for it in writing if they do not send you a letter. You have a right to understand what happened.'
      },
      {
        title: 'If They Made a Mistake',
        content: 'SSA makes mistakes. If you think they got your income wrong, calculated something incorrectly, or are using outdated information, you can appeal. Request a reconsideration within 60 days of the notice.'
      },
      {
        title: 'The Income Calculation',
        content: 'SSI has complicated rules about how income affects your payment. Generally, SSA does not count the first $20 of any income and the first $65 of earned income. After that, your SSI goes down $1 for every $2 you earn from work. If this sounds confusing, it is. Ask SSA to show you the math.'
      }
    ],

    doThis: [
      'Request a written explanation of the change',
      'Check if the income amount they are using is correct',
      'Appeal within 10 days if you want benefits to continue at the old amount while you fight',
      'Keep pay stubs and records of any income'
    ]
  },

  'benefits-stopped': {
    title: 'Your Benefits Were Stopped',
    intro: 'Having your SSI stopped completely is scary. But benefits can often be reinstated, especially if SSA made a mistake or you can fix the problem.',
    
    sections: [
      {
        title: 'Common Reasons Benefits Stop',
        bullets: [
          'Too much income (over the limit)',
          'Too many assets (over $2,000)',
          'Did not complete a review (CDR or redetermination)',
          'Did not report a change',
          'Medical condition improved (according to SSA)',
          'Left the country for 30 or more days'
        ]
      },
      {
        title: 'Act Fast: The 10 Day Rule',
        content: 'If you appeal within 10 days of getting the notice, your benefits usually continue while SSA reviews your case. This is huge. Even if you are not sure you will win, it gives you time and keeps money coming in.',
        warning: true
      },
      {
        title: 'Expedited Reinstatement',
        content: 'If your benefits stopped because you were working and earning too much, but now you cannot work anymore because of your disability, you may be able to get benefits restarted quickly without a full new application. This is called expedited reinstatement and is available for up to 5 years after benefits stopped.'
      }
    ],

    doThis: [
      'Appeal within 10 days to keep benefits while fighting',
      'Find out the exact reason benefits stopped',
      'Gather documents that prove SSA is wrong (if they are)',
      'Contact legal aid immediately'
    ]
  },

  working: {
    title: 'Working While on SSI',
    intro: 'You can work and still get SSI. In fact, there are special programs to help you try working without risking everything. But you have to report your earnings.',
    
    sections: [
      {
        title: 'How Work Affects Your SSI',
        content: 'When you work, your SSI payment goes down, but not dollar for dollar. SSA ignores the first $65 of what you earn, then only counts half the rest. So if you earn $500 from work, SSA only counts about $217 against your SSI.'
      },
      {
        title: 'Work Incentives That Help You Keep More',
        content: 'There are several programs that let you keep more of your SSI when working:',
        bullets: [
          'IRWE (Impairment Related Work Expenses): Costs related to your disability that you need for work (wheelchair, medication, special transportation) do not count against you',
          'PASS (Plan to Achieve Self Support): Set aside money for a work goal and it will not count',
          'Student Earned Income Exclusion: If you are under 22 and in school, you can earn more',
          '1619(b): Keep your Medicaid even if you earn too much for an SSI check'
        ]
      },
      {
        title: '1619(b): The Safety Net',
        content: 'This is important. Even if you work so much that your SSI check goes to zero, you can usually keep your Medicaid coverage through something called 1619(b). Each state has a threshold. As long as your earnings are below that amount, you keep Medicaid. For many people, this is the most valuable benefit because healthcare is so expensive.'
      },
      {
        title: 'Report Your Earnings',
        content: 'You must report your earnings to SSA. The best way is through the SSI Telephone Wage Reporting system (1-800-772-1213) or the my Social Security app. Report within 10 days after the end of the month. Not reporting can lead to overpayments.'
      }
    ],

    doThis: [
      'Report earnings within 10 days after the month ends',
      'Keep all pay stubs',
      'Track disability related work expenses (potential IRWE)',
      'Ask about a PASS plan if you have a work goal',
      'Learn your state 1619(b) threshold'
    ]
  },

  reporting: {
    title: 'What Changes Do I Report?',
    intro: 'SSI requires you to report changes in your life. Not reporting or reporting late can cause overpayments and other problems. Here is what SSA needs to know.',
    
    sections: [
      {
        title: 'Report These Changes Within 10 Days',
        bullets: [
          'You start or stop working, or your pay changes',
          'You move or your address changes',
          'Someone moves in or out of your home',
          'You get married, separated, or divorced',
          'You get any other income (gifts, inheritance, other benefits)',
          'Your bank balance goes over $2,000',
          'You enter or leave a hospital or nursing home',
          'You leave the United States',
          'You are no longer disabled (your condition improves)',
          'A child turns 18'
        ]
      },
      {
        title: 'How to Report',
        content: 'You can report changes by:',
        bullets: [
          'Calling SSA: 1-800-772-1213 (TTY: 1-800-325-0778)',
          'Using your my Social Security account online',
          'Visiting your local Social Security office',
          'Using the SSI Mobile Wage Reporting app (for earnings)'
        ]
      },
      {
        title: 'Keep Records',
        content: 'Always keep a record of what you reported and when. Write down the date, the name of who you spoke with, and what you told them. If you report by mail, send copies (never originals) and use certified mail. This protects you if SSA later claims you did not report something.'
      }
    ],

    doThis: [
      'Report changes within 10 days',
      'Keep a log of every report you make',
      'Save copies of everything',
      'Get the name of anyone you speak with at SSA'
    ],

    dontDoThis: [
      'Do not assume SSA already knows about a change',
      'Do not wait until your review to report something',
      'Do not send original documents. Always send copies'
    ]
  }
};

export const APPEAL_STEPS = [
  {
    step: 1,
    title: 'Request Reconsideration',
    deadline: '60 days from the decision',
    description: 'A different SSA employee reviews your case. File within 10 days to keep benefits while appealing.',
    form: 'SSA-561'
  },
  {
    step: 2,
    title: 'Hearing with a Judge',
    deadline: '60 days from reconsideration decision',
    description: 'You appear before an Administrative Law Judge. You can bring witnesses and a representative.',
    form: 'HA-501'
  },
  {
    step: 3,
    title: 'Appeals Council Review',
    deadline: '60 days from hearing decision',
    description: 'The Appeals Council in Virginia reviews the judge decision.',
    form: 'HA-520'
  },
  {
    step: 4,
    title: 'Federal Court',
    deadline: '60 days from Appeals Council',
    description: 'File a lawsuit in federal district court. You will likely need a lawyer.',
    form: 'Civil complaint'
  }
];

export const IMPORTANT_FORMS = [
  {
    number: 'SSA-632',
    name: 'Request for Waiver of Overpayment',
    use: 'Ask SSA to forgive an overpayment',
    url: 'https://www.ssa.gov/forms/ssa-632.pdf'
  },
  {
    number: 'SSA-561',
    name: 'Request for Reconsideration',
    use: 'Appeal a decision you disagree with',
    url: 'https://www.ssa.gov/forms/ssa-561.pdf'
  },
  {
    number: 'SSA-634',
    name: 'Request for Change in Overpayment Recovery Rate',
    use: 'Ask to pay back less each month',
    url: 'https://www.ssa.gov/forms/ssa-634.pdf'
  },
  {
    number: 'SSA-795',
    name: 'Statement of Claimant or Other Person',
    use: 'Write your own statement explaining your situation',
    url: 'https://www.ssa.gov/forms/ssa-795.pdf'
  }
];

export const LEGAL_AID_INFO = {
  intro: 'You have the right to free legal help. These organizations specialize in SSI cases:',
  national: [
    {
      name: 'Disability Rights (Protection and Advocacy)',
      desc: 'Every state has one. They provide free legal help for people with disabilities.',
      url: 'https://www.ndrn.org/about/ndrn-member-agencies/'
    },
    {
      name: 'Legal Aid and Legal Services',
      desc: 'Free lawyers for low income people. Find yours at:',
      url: 'https://www.lawhelp.org'
    },
    {
      name: 'Benefits Checkup',
      desc: 'Find benefits programs you may qualify for',
      url: 'https://www.benefitscheckup.org'
    }
  ]
};