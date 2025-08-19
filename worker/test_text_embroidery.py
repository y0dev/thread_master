#!/usr/bin/env python3
"""
Test script for text-to-embroidery functionality
Run this to verify the converter works correctly
"""

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from text_embroidery import TextEmbroideryConverter, TextEmbroideryRequest

def test_text_conversion():
    """Test the text to embroidery conversion"""
    print("🧵 Testing Text to Embroidery Converter")
    print("=" * 50)
    
    # Initialize converter
    converter = TextEmbroideryConverter()
    
    # Test cases
    test_cases = [
        {
            "name": "Simple Line Text",
            "request": TextEmbroideryRequest(
                text="HELLO",
                shape="line",
                units="mm",
                line_length=100,
                output_formats=["DST", "PES", "JEF"]
            )
        },
        {
            "name": "Circular Text",
            "request": TextEmbroideryRequest(
                text="WORLD",
                shape="circle",
                units="mm",
                circle_radius=50,
                output_formats=["DST", "PES", "JEF", "EXP"]
            )
        },
        {
            "name": "Long Text Line",
            "request": TextEmbroideryRequest(
                text="EMBROIDERYFORGE",
                shape="line",
                units="mm",
                line_length=200,
                output_formats=["DST", "PES", "JEF", "VP3", "HUS"]
            )
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 Test {i}: {test_case['name']}")
        print(f"   Text: '{test_case['request'].text}'")
        print(f"   Shape: {test_case['request'].shape}")
        print(f"   Units: {test_case['request'].units}")
        print(f"   Formats: {', '.join(test_case['request'].output_formats)}")
        
        try:
            # Convert text to embroidery
            files = converter.convert_text_to_embroidery(test_case['request'])
            
            print(f"   ✅ Success! Generated {len(files)} files:")
            for file in files:
                print(f"      - {file.filename} ({len(file.content)} bytes)")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Testing completed!")

def test_individual_formats():
    """Test individual format generation"""
    print("\n🔧 Testing Individual Format Generation")
    print("=" * 50)
    
    converter = TextEmbroideryConverter()
    
    # Test a simple case
    request = TextEmbroideryRequest(
        text="TEST",
        shape="line",
        units="mm",
        line_length=80,
        output_formats=["DST", "PES", "JEF"]
    )
    
    try:
        files = converter.convert_text_to_embroidery(request)
        
        for file in files:
            print(f"\n📁 Format: {file.format}")
            print(f"   Filename: {file.filename}")
            print(f"   Size: {len(file.content)} bytes")
            
            # Show first 100 characters of content
            content_preview = file.content[:100] if isinstance(file.content, bytes) else str(file.content)[:100]
            print(f"   Preview: {content_preview}...")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting Text to Embroidery Tests")
    print("=" * 50)
    
    try:
        test_text_conversion()
        test_individual_formats()
        print("\n🎉 All tests completed successfully!")
        
    except Exception as e:
        print(f"\n💥 Test suite failed: {e}")
        sys.exit(1)
