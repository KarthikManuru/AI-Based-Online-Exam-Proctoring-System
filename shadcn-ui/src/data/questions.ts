// Question sets for the CSE Department Event Quiz
// 4 sets (A, B, C, D) with 10 questions each

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuestionSet {
  setId: 'A' | 'B' | 'C' | 'D';
  questions: Question[];
}

export const questionSets: QuestionSet[] = [
  {
    setId: 'A',
    questions: [
      {
        id: 'A1',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correctIndex: 0
      },
      {
        id: 'A2',
        question: 'Which programming language is known as the "language of the web"?',
        options: ['Python', 'Java', 'JavaScript', 'C++'],
        correctIndex: 2
      },
      {
        id: 'A3',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctIndex: 1
      },
      {
        id: 'A4',
        question: 'Which data structure uses LIFO (Last In First Out)?',
        options: ['Queue', 'Stack', 'Array', 'Tree'],
        correctIndex: 1
      },
      {
        id: 'A5',
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correctIndex: 1
      },
      {
        id: 'A6',
        question: 'Which of the following is NOT a programming paradigm?',
        options: ['Object-Oriented', 'Functional', 'Procedural', 'Sequential'],
        correctIndex: 3
      },
      {
        id: 'A7',
        question: 'What is the default port for HTTP?',
        options: ['8080', '443', '80', '3000'],
        correctIndex: 2
      },
      {
        id: 'A8',
        question: 'Which sorting algorithm has the best average-case time complexity?',
        options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'],
        correctIndex: 1
      },
      {
        id: 'A9',
        question: 'What does API stand for?',
        options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Integration', 'Automated Programming Interface'],
        correctIndex: 0
      },
      {
        id: 'A10',
        question: 'Which database is a NoSQL database?',
        options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
        correctIndex: 2
      },
      {
        id: 'A11',
        question: 'Which database is a NoSQL database?',
        options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
        correctIndex: 2
      },
      {
        id: 'A12',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correctIndex: 0
      },
      {
        id: 'A13',
        question: 'Which programming language is known as the "language of the web"?',
        options: ['Python', 'Java', 'JavaScript', 'C++'],
        correctIndex: 2
      },
      {
        id: 'A14',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctIndex: 1
      },
      {
        id: 'A15',
        question: 'Which data structure uses LIFO (Last In First Out)?',
        options: ['Queue', 'Stack', 'Array', 'Tree'],
        correctIndex: 1
      },
      {
        id: 'A16',
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correctIndex: 1
      },
      {
        id: 'A17',
        question: 'Which of the following is NOT a programming paradigm?',
        options: ['Object-Oriented', 'Functional', 'Procedural', 'Sequential'],
        correctIndex: 3
      },
      {
        id: 'A18',
        question: 'What is the default port for HTTP?',
        options: ['8080', '443', '80', '3000'],
        correctIndex: 2
      },
      {
        id: 'A19',
        question: 'Which sorting algorithm has the best average-case time complexity?',
        options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'],
        correctIndex: 1
      },
      {
        id: 'A20',
        question: 'What does API stand for?',
        options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Integration', 'Automated Programming Interface'],
        correctIndex: 0
      }
    ]
  },
  {
    setId: 'B',
    questions: [
      {
        id: 'B1',
        question: 'What is the full form of SQL?',
        options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
        correctIndex: 0
      },
      {
        id: 'B2',
        question: 'Which of these is a version control system?',
        options: ['Docker', 'Git', 'Jenkins', 'Kubernetes'],
        correctIndex: 1
      },
      {
        id: 'B3',
        question: 'What is the space complexity of a recursive Fibonacci function?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 1
      },
      {
        id: 'B4',
        question: 'Which protocol is used for secure communication over the internet?',
        options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
        correctIndex: 2
      },
      {
        id: 'B5',
        question: 'What does OOP stand for?',
        options: ['Object-Oriented Programming', 'Objective Operational Programming', 'Open Object Programming', 'Organized Object Programming'],
        correctIndex: 0
      },
      {
        id: 'B6',
        question: 'Which data structure is used for BFS (Breadth First Search)?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctIndex: 1
      },
      {
        id: 'B7',
        question: 'What is the purpose of a compiler?',
        options: ['Execute code', 'Debug code', 'Translate code to machine language', 'Format code'],
        correctIndex: 2
      },
      {
        id: 'B8',
        question: 'Which of the following is a relational database?',
        options: ['Redis', 'Cassandra', 'PostgreSQL', 'MongoDB'],
        correctIndex: 2
      },
      {
        id: 'B9',
        question: 'What does RAM stand for?',
        options: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Memory', 'Remote Access Memory'],
        correctIndex: 0
      },
      {
        id: 'B10',
        question: 'Which HTTP method is used to update a resource?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctIndex: 2
      },
      {
        id: 'B11',
        question: 'Which HTTP method is used to update a resource?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctIndex: 2
      },
      {
        id: 'B12',
        question: 'What is the full form of SQL?',
        options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
        correctIndex: 0
      },
      {
        id: 'B13',
        question: 'Which of these is a version control system?',
        options: ['Docker', 'Git', 'Jenkins', 'Kubernetes'],
        correctIndex: 1
      },
      {
        id: 'B14',
        question: 'What is the space complexity of a recursive Fibonacci function?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 1
      },
      {
        id: 'B15',
        question: 'Which protocol is used for secure communication over the internet?',
        options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
        correctIndex: 2
      },
      {
        id: 'B16',
        question: 'What does OOP stand for?',
        options: ['Object-Oriented Programming', 'Objective Operational Programming', 'Open Object Programming', 'Organized Object Programming'],
        correctIndex: 0
      },
      {
        id: 'B17',
        question: 'Which data structure is used for BFS (Breadth First Search)?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctIndex: 1
      },
      {
        id: 'B18',
        question: 'What is the purpose of a compiler?',
        options: ['Execute code', 'Debug code', 'Translate code to machine language', 'Format code'],
        correctIndex: 2
      },
      {
        id: 'B19',
        question: 'Which of the following is a relational database?',
        options: ['Redis', 'Cassandra', 'PostgreSQL', 'MongoDB'],
        correctIndex: 2
      },
      {
        id: 'B20',
        question: 'What does RAM stand for?',
        options: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Memory', 'Remote Access Memory'],
        correctIndex: 0
      }
    ]
  },
  {
    setId: 'C',
    questions: [
      {
        id: 'C1',
        question: 'What is the output of 2 ** 3 in Python?',
        options: ['6', '8', '9', '5'],
        correctIndex: 1
      },
      {
        id: 'C2',
        question: 'Which of these is NOT a JavaScript framework?',
        options: ['React', 'Angular', 'Vue', 'Django'],
        correctIndex: 3
      },
      {
        id: 'C3',
        question: 'What does DNS stand for?',
        options: ['Domain Name System', 'Digital Network Service', 'Data Name Server', 'Domain Network System'],
        correctIndex: 0
      },
      {
        id: 'C4',
        question: 'Which algorithm is used for finding the shortest path in a graph?',
        options: ['Binary Search', 'Dijkstra\'s Algorithm', 'Bubble Sort', 'Linear Search'],
        correctIndex: 1
      },
      {
        id: 'C5',
        question: 'What is the base of the binary number system?',
        options: ['2', '8', '10', '16'],
        correctIndex: 0
      },
      {
        id: 'C6',
        question: 'Which of the following is a cloud service provider?',
        options: ['GitHub', 'AWS', 'npm', 'Docker'],
        correctIndex: 1
      },
      {
        id: 'C7',
        question: 'What does IDE stand for?',
        options: ['Integrated Development Environment', 'Internet Development Environment', 'Interactive Development Engine', 'Integrated Design Environment'],
        correctIndex: 0
      },
      {
        id: 'C8',
        question: 'Which data structure uses FIFO (First In First Out)?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctIndex: 1
      },
      {
        id: 'C9',
        question: 'What is the purpose of a firewall?',
        options: ['Speed up internet', 'Block unauthorized access', 'Store data', 'Compile code'],
        correctIndex: 1
      },
      {
        id: 'C10',
        question: 'Which of these is a markup language?',
        options: ['Python', 'Java', 'XML', 'C++'],
        correctIndex: 2
      },
      {
        id: 'C11',
        question: 'Which of these is a markup language?',
        options: ['Python', 'Java', 'XML', 'C++'],
        correctIndex: 2
      },
      {
        id: 'C12',
        question: 'What is the output of 2 ** 3 in Python?',
        options: ['6', '8', '9', '5'],
        correctIndex: 1
      },
      {
        id: 'C13',
        question: 'Which of these is NOT a JavaScript framework?',
        options: ['React', 'Angular', 'Vue', 'Django'],
        correctIndex: 3
      },
      {
        id: 'C14',
        question: 'What does DNS stand for?',
        options: ['Domain Name System', 'Digital Network Service', 'Data Name Server', 'Domain Network System'],
        correctIndex: 0
      },
      {
        id: 'C15',
        question: 'Which algorithm is used for finding the shortest path in a graph?',
        options: ['Binary Search', 'Dijkstra\'s Algorithm', 'Bubble Sort', 'Linear Search'],
        correctIndex: 1
      },
      {
        id: 'C16',
        question: 'What is the base of the binary number system?',
        options: ['2', '8', '10', '16'],
        correctIndex: 0
      },
      {
        id: 'C17',
        question: 'Which of the following is a cloud service provider?',
        options: ['GitHub', 'AWS', 'npm', 'Docker'],
        correctIndex: 1
      },
      {
        id: 'C18',
        question: 'What does IDE stand for?',
        options: ['Integrated Development Environment', 'Internet Development Environment', 'Interactive Development Engine', 'Integrated Design Environment'],
        correctIndex: 0
      },
      {
        id: 'C19',
        question: 'Which data structure uses FIFO (First In First Out)?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctIndex: 1
      },
      {
        id: 'C20',
        question: 'What is the purpose of a firewall?',
        options: ['Speed up internet', 'Block unauthorized access', 'Store data', 'Compile code'],
        correctIndex: 1
      }
    ]
  },
  {
    setId: 'D',
    questions: [
      {
        id: 'D1',
        question: 'What is the time complexity of accessing an element in an array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 0
      },
      {
        id: 'D2',
        question: 'Which of the following is a server-side language?',
        options: ['HTML', 'CSS', 'JavaScript', 'PHP'],
        correctIndex: 3
      },
      {
        id: 'D3',
        question: 'What does JSON stand for?',
        options: ['JavaScript Object Notation', 'Java Standard Object Notation', 'JavaScript Oriented Notation', 'Java Serialized Object Notation'],
        correctIndex: 0
      },
      {
        id: 'D4',
        question: 'Which sorting algorithm is the fastest for small datasets?',
        options: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Heap Sort'],
        correctIndex: 2
      },
      {
        id: 'D5',
        question: 'What is the purpose of an operating system?',
        options: ['Write code', 'Manage hardware and software resources', 'Browse the internet', 'Create databases'],
        correctIndex: 1
      },
      {
        id: 'D6',
        question: 'Which of these is a containerization platform?',
        options: ['Git', 'Docker', 'npm', 'Webpack'],
        correctIndex: 1
      },
      {
        id: 'D7',
        question: 'What does URL stand for?',
        options: ['Universal Resource Locator', 'Uniform Resource Locator', 'Universal Reference Link', 'Uniform Reference Locator'],
        correctIndex: 1
      },
      {
        id: 'D8',
        question: 'Which data structure is best for implementing a priority queue?',
        options: ['Array', 'Linked List', 'Heap', 'Stack'],
        correctIndex: 2
      },
      {
        id: 'D9',
        question: 'What is the default port for HTTPS?',
        options: ['80', '443', '8080', '3000'],
        correctIndex: 1
      },
      {
        id: 'D10',
        question: 'Which of the following is an interpreted language?',
        options: ['C', 'C++', 'Python', 'Java'],
        correctIndex: 2
      },
      {
        id: 'D11',
        question: 'Which of the following is an interpreted language?',
        options: ['C', 'C++', 'Python', 'Java'],
        correctIndex: 2
      },
      {
        id: 'D12',
        question: 'What is the time complexity of accessing an element in an array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 0
      },
      {
        id: 'D13',
        question: 'Which of the following is a server-side language?',
        options: ['HTML', 'CSS', 'JavaScript', 'PHP'],
        correctIndex: 3
      },
      {
        id: 'D14',
        question: 'What does JSON stand for?',
        options: ['JavaScript Object Notation', 'Java Standard Object Notation', 'JavaScript Oriented Notation', 'Java Serialized Object Notation'],
        correctIndex: 0
      },
      {
        id: 'D15',
        question: 'Which sorting algorithm is the fastest for small datasets?',
        options: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Heap Sort'],
        correctIndex: 2
      },
      {
        id: 'D16',
        question: 'What is the purpose of an operating system?',
        options: ['Write code', 'Manage hardware and software resources', 'Browse the internet', 'Create databases'],
        correctIndex: 1
      },
      {
        id: 'D17',
        question: 'Which of these is a containerization platform?',
        options: ['Git', 'Docker', 'npm', 'Webpack'],
        correctIndex: 1
      },
      {
        id: 'D18',
        question: 'What does URL stand for?',
        options: ['Universal Resource Locator', 'Uniform Resource Locator', 'Universal Reference Link', 'Uniform Reference Locator'],
        correctIndex: 1
      },
      {
        id: 'D19',
        question: 'Which data structure is best for implementing a priority queue?',
        options: ['Array', 'Linked List', 'Heap', 'Stack'],
        correctIndex: 2
      },
      {
        id: 'D20',
        question: 'What is the default port for HTTPS?',
        options: ['80', '443', '8080', '3000'],
        correctIndex: 1
      }
    ]
  }
];

// Function to get questions without correct answers (for frontend)
export const getQuestionSetForStudent = (setId: 'A' | 'B' | 'C' | 'D') => {
  const set = questionSets.find(s => s.setId === setId);
  if (!set) return null;
  
  return {
    setId: set.setId,
    questions: set.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }))
  };
};

// Function to validate answers (simulates backend)
export const validateAnswers = (setId: 'A' | 'B' | 'C' | 'D', answers: number[]) => {
  const set = questionSets.find(s => s.setId === setId);
  if (!set) return null;
  
  let score = 0;
  const responses = set.questions.map((q, index) => {
    const chosenIndex = answers[index] ?? -1;
    const isCorrect = chosenIndex === q.correctIndex;
    if (isCorrect) score++;
    
    return {
      question: q.question,
      options: q.options,
      chosenIndex,
      correctIndex: q.correctIndex,
      isCorrect
    };
  });
  
  return {
    score,
    totalQuestions: set.questions.length,
    responses
  };
};