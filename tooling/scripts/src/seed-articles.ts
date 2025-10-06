import { prisma } from "@betterlms/database";

const SAMPLE_ARTICLES = [
	{
		title: "Getting Started with TypeScript: A Developer's Guide",
		content: `
			<h2>Introduction to TypeScript</h2>
			<p>TypeScript has revolutionized the way we write JavaScript applications. With its powerful type system and excellent tooling support, it has become an essential tool for modern web development.</p>
			
			<h3>Why Choose TypeScript?</h3>
			<ul>
				<li><strong>Type Safety:</strong> Catch errors at compile time instead of runtime</li>
				<li><strong>Better IDE Support:</strong> Enhanced autocomplete and refactoring capabilities</li>
				<li><strong>Improved Code Quality:</strong> Self-documenting code with explicit types</li>
				<li><strong>Gradual Adoption:</strong> Can be introduced incrementally to existing JavaScript projects</li>
			</ul>
			
			<h3>Basic Type Annotations</h3>
			<pre><code>// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array&lt;string&gt; = ["Alice", "Bob", "Charlie"];

// Objects
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
}

const user: User = {
  id: 1,
  name: "John Doe"
};</code></pre>
			
			<h3>Advanced Features</h3>
			<p>TypeScript offers advanced features like generics, union types, and conditional types that make it incredibly powerful for building complex applications.</p>
			
			<h4>Generics Example</h4>
			<pre><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}

const result = identity&lt;string&gt;("Hello, TypeScript!");</code></pre>
			
			<p>Start your TypeScript journey today and experience the benefits of type-safe JavaScript development!</p>
		`,
		channelName: "JavaScript",
	},
	{
		title: "Building RESTful APIs with FastAPI and Python",
		content: `
			<h2>FastAPI: The Modern Python Web Framework</h2>
			<p>FastAPI has quickly become one of the most popular Python web frameworks for building APIs. Its combination of high performance, automatic documentation, and type hints makes it an excellent choice for modern web development.</p>
			
			<h3>Key Features</h3>
			<ul>
				<li><strong>High Performance:</strong> One of the fastest Python frameworks available</li>
				<li><strong>Automatic API Documentation:</strong> Interactive docs with Swagger UI</li>
				<li><strong>Type Hints:</strong> Full support for Python type annotations</li>
				<li><strong>Async Support:</strong> Built-in support for async/await</li>
			</ul>
			
			<h3>Basic FastAPI Application</h3>
			<pre><code>from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="My API", version="1.0.0")

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    return item

@app.get("/items/", response_model=List[Item])
async def read_items():
    return [
        {"name": "Laptop", "price": 999.99, "description": "Gaming laptop"},
        {"name": "Mouse", "price": 29.99, "description": "Wireless mouse"}
    ]</code></pre>
			
			<h3>Database Integration</h3>
			<p>FastAPI works seamlessly with databases through SQLAlchemy or Tortoise ORM. Here's a quick example with SQLAlchemy:</p>
			
			<pre><code>from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)</code></pre>
			
			<p>FastAPI's automatic validation, serialization, and documentation make it an excellent choice for building robust APIs quickly.</p>
		`,
		channelName: "Python",
	},
	{
		title: "Understanding Large Language Models: A Technical Deep Dive",
		content: `
			<h2>What are Large Language Models?</h2>
			<p>Large Language Models (LLMs) are artificial intelligence systems trained on vast amounts of text data to understand and generate human-like text. They represent a significant breakthrough in natural language processing and artificial intelligence.</p>
			
			<h3>Architecture Overview</h3>
			<p>Most modern LLMs are based on the Transformer architecture, which uses attention mechanisms to process sequences of text efficiently.</p>
			
			<h4>Key Components:</h4>
			<ul>
				<li><strong>Embedding Layer:</strong> Converts tokens to dense vector representations</li>
				<li><strong>Transformer Blocks:</strong> Multiple layers of self-attention and feed-forward networks</li>
				<li><strong>Attention Mechanism:</strong> Allows the model to focus on relevant parts of the input</li>
				<li><strong>Output Layer:</strong> Generates probability distributions over vocabulary</li>
			</ul>
			
			<h3>Training Process</h3>
			<p>LLMs undergo extensive training on diverse text corpora:</p>
			
			<ol>
				<li><strong>Pre-training:</strong> Learning general language patterns from large datasets</li>
				<li><strong>Fine-tuning:</strong> Adapting the model for specific tasks or domains</li>
				<li><strong>Alignment:</strong> Ensuring the model follows human preferences and safety guidelines</li>
			</ol>
			
			<h3>Popular LLM Architectures</h3>
			<table>
				<thead>
					<tr>
						<th>Model</th>
						<th>Parameters</th>
						<th>Key Features</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>GPT-4</td>
						<td>~1.7T</td>
						<td>Multimodal, strong reasoning</td>
					</tr>
					<tr>
						<td>Claude 3</td>
						<td>~175B</td>
						<td>Constitutional AI, helpful</td>
					</tr>
					<tr>
						<td>Llama 3</td>
						<td>8B-405B</td>
						<td>Open source, efficient</td>
					</tr>
				</tbody>
			</table>
			
			<h3>Applications and Use Cases</h3>
			<ul>
				<li><strong>Code Generation:</strong> GitHub Copilot, ChatGPT for programming</li>
				<li><strong>Content Creation:</strong> Writing, editing, and creative tasks</li>
				<li><strong>Question Answering:</strong> Information retrieval and explanation</li>
				<li><strong>Translation:</strong> Multi-language support and localization</li>
			</ul>
			
			<h3>Challenges and Considerations</h3>
			<p>While LLMs are powerful, they come with important considerations:</p>
			<ul>
				<li><strong>Hallucination:</strong> Generating plausible but incorrect information</li>
				<li><strong>Bias:</strong> Reflecting biases present in training data</li>
				<li><strong>Computational Cost:</strong> High resource requirements for training and inference</li>
				<li><strong>Safety:</strong> Potential for misuse or harmful outputs</li>
			</ul>
			
			<p>Understanding these models' capabilities and limitations is crucial for responsible AI development and deployment.</p>
		`,
		channelName: "AI & LLMs",
	},
	{
		title: "React Hooks: Mastering State Management and Side Effects",
		content: `
			<h2>Introduction to React Hooks</h2>
			<p>React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components. Introduced in React 16.8, hooks provide a more direct API to React concepts.</p>
			
			<h3>Core Hooks</h3>
			
			<h4>useState</h4>
			<p>The most fundamental hook for managing component state:</p>
			<pre><code>import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
			
			<h4>useEffect</h4>
			<p>Handles side effects in functional components:</p>
			<pre><code>import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/users/' + userId);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]); // Dependency array
  
  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  if (!user) return &lt;div&gt;User not found&lt;/div&gt;;
  
  return (
    &lt;div&gt;
      &lt;h2&gt;{user.name}&lt;/h2&gt;
      &lt;p&gt;{user.email}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
			
			<h3>Custom Hooks</h3>
			<p>Create reusable stateful logic with custom hooks:</p>
			<pre><code>import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
function MyComponent() {
  const [name, setName] = useLocalStorage('name', '');
  
  return (
    &lt;input
      value={name}
      onChange={(e) =&gt; setName(e.target.value)}
      placeholder="Enter your name"
    /&gt;
  );
}</code></pre>
			
			<h3>Advanced Hooks</h3>
			<ul>
				<li><strong>useContext:</strong> Access React context without nesting</li>
				<li><strong>useReducer:</strong> Manage complex state logic</li>
				<li><strong>useMemo:</strong> Optimize expensive calculations</li>
				<li><strong>useCallback:</strong> Optimize function references</li>
			</ul>
			
			<h3>Best Practices</h3>
			<ol>
				<li>Only call hooks at the top level of React functions</li>
				<li>Use the dependency array in useEffect correctly</li>
				<li>Create custom hooks for reusable logic</li>
				<li>Use useMemo and useCallback judiciously</li>
			</ol>
			
			<p>Hooks provide a powerful and flexible way to build React applications with cleaner, more maintainable code.</p>
		`,
		channelName: "JavaScript",
	},
	{
		title: "Prompt Engineering: Crafting Effective Instructions for LLMs",
		content: `
			<h2>The Art of Prompt Engineering</h2>
			<p>Prompt engineering is the practice of designing inputs (prompts) to get desired outputs from large language models. As LLMs become more prevalent, mastering this skill is crucial for developers and AI practitioners.</p>
			
			<h3>Fundamental Principles</h3>
			
			<h4>1. Clarity and Specificity</h4>
			<p>Be explicit about what you want. Vague prompts lead to unpredictable results.</p>
			<pre><code>// Poor prompt
"Write about AI"

// Better prompt
"Write a 500-word technical article about the transformer architecture in large language models, focusing on the attention mechanism and its computational complexity."</code></pre>
			
			<h4>2. Provide Context</h4>
			<p>Give the model relevant background information to work with:</p>
			<pre><code>// Context-rich prompt
"You are a senior software engineer with 10 years of experience in Python and web development. A junior developer on your team is struggling with async/await concepts. Write a clear explanation with practical examples that will help them understand when and how to use async/await in Python."</code></pre>
			
			<h4>3. Use Examples</h4>
			<p>Few-shot prompting with examples can dramatically improve results:</p>
			<pre><code>// Few-shot example
"Convert the following sentences to formal business language:

Example 1:
Input: 'Hey, can you send me that file?'
Output: 'Could you please forward the requested document at your earliest convenience?'

Example 2:
Input: 'This code is broken'
Output: 'The current implementation requires debugging to resolve the identified issues.'

Now convert: 'I need this done ASAP'"</code></pre>
			
			<h3>Advanced Techniques</h3>
			
			<h4>Chain of Thought</h4>
			<p>Encourage step-by-step reasoning:</p>
			<pre><code>"Solve this problem step by step:

Problem: A company has 100 employees. 60% work remotely, 25% work in the office, and 15% work hybrid. If 30% of remote workers are developers, how many remote developers are there?

Let me think through this step by step:
1. First, I need to find how many employees work remotely
2. Then, I need to find what percentage of those are developers
3. Finally, I'll calculate the actual number"</code></pre>
			
			<h4>Role-Based Prompting</h4>
			<p>Assign specific roles to guide the model's behavior:</p>
			<pre><code>"You are a cybersecurity expert reviewing code for potential vulnerabilities. Analyze the following Python function and identify any security issues:

def process_user_input(user_data):
    query = f"SELECT * FROM users WHERE id = {user_data['id']}"
    return execute_query(query)"</code></pre>
			
			<h3>Common Patterns</h3>
			<ul>
				<li><strong>Template-based:</strong> Use consistent structures for similar tasks</li>
				<li><strong>Iterative refinement:</strong> Build upon previous outputs</li>
				<li><strong>Constraint specification:</strong> Set clear boundaries and requirements</li>
				<li><strong>Output formatting:</strong> Specify desired format (JSON, markdown, etc.)</li>
			</ul>
			
			<h3>Testing and Optimization</h3>
			<p>Effective prompt engineering requires testing and iteration:</p>
			<ol>
				<li>Start with a simple prompt and gradually add complexity</li>
				<li>Test with various inputs to ensure consistency</li>
				<li>Compare different prompt variations</li>
				<li>Document successful patterns for reuse</li>
			</ol>
			
			<h3>Tools and Resources</h3>
			<ul>
				<li><strong>Prompt libraries:</strong> Collections of tested prompts</li>
				<li><strong>Prompt testing frameworks:</strong> Systematic evaluation tools</li>
				<li><strong>Version control:</strong> Track prompt changes and results</li>
				<li><strong>A/B testing:</strong> Compare prompt effectiveness</li>
			</ul>
			
			<p>Mastering prompt engineering is essential for anyone working with LLMs. It's both an art and a science that combines creativity with systematic testing and optimization.</p>
		`,
		channelName: "AI & LLMs",
	},
];

async function seedArticles() {
	console.log("🌱 Seeding articles...");

	// Get users for assignment
	const users = await prisma.user.findMany();
	if (users.length === 0) {
		console.error("❌ No users found. Please run seed:users first.");
		process.exit(1);
	}

	// Get existing channels
	const channels = await prisma.channel.findMany();
	if (channels.length === 0) {
		console.error("❌ No channels found. Please run seed:channels first.");
		process.exit(1);
	}

	// Create articles (posts with titles)
	console.log("📝 Creating articles...");
	for (const article of SAMPLE_ARTICLES) {
		const channel = channels.find((c) => c.name === article.channelName);
		const randomUser = users[Math.floor(Math.random() * users.length)];

		if (!channel || !randomUser) {
			console.warn("⚠️  Skipping article: missing channel or user");
			continue;
		}

		await prisma.post.create({
			data: {
				title: article.title,
				content: article.content.trim(),
				channelId: channel.id,
				userId: randomUser.id,
			},
		});

		console.log(`✅ Created article: ${article.title}`);
	}

	console.log("✨ Articles seeded successfully!");
}

seedArticles()
	.catch((error) => {
		console.error("❌ Error seeding articles:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
