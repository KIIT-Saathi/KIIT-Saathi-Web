// app/test-css/page.jsx
export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Testing Custom CSS Classes</h1>
      
      {/* Test 1: Glass card */}
      <div className="glass-card p-6 mb-4">
        <p>This should have glass effect</p>
      </div>
      
      {/* Test 2: Gradient text */}
      <h2 className="gradient-text text-2xl font-bold mb-4">
        This should have gradient text
      </h2>
      
      {/* Test 3: Gradient background */}
      <div className="gradient-bg text-white p-4 rounded-xl mb-4">
        This should have gradient background
      </div>
      
      {/* Test 4: Primary button */}
      <button className="btn-primary mb-4">
        This should be a gradient button
      </button>
      
      {/* Test 5: Float animation */}
      <div className="animate-float bg-green-500 w-20 h-20 rounded-full">
        Floating
      </div>
    </div>
  );
}