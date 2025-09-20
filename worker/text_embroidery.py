#!/usr/bin/env python3
"""
Text to Embroidery Converter
This module provides functionality to convert text into embroidery machine files.
"""

import os
import math
import json
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class EmbroideryFormat(Enum):
    DST = "dst"
    PES = "pes"
    JEF = "jef"
    EXP = "exp"
    VP3 = "vp3"
    HUS = "hus"

@dataclass
class TextEmbroideryRequest:
    text: str
    shape: str  # 'line' or 'circle'
    units: str  # 'mm' or 'inches'
    line_length: Optional[float] = None
    circle_radius: Optional[float] = None
    output_formats: List[str] = None

@dataclass
class EmbroideryFile:
    format: str
    content: bytes
    filename: str

class TextEmbroideryConverter:
    def __init__(self):
        self.stitch_density = 0.4  # stitches per mm
        self.character_width = 6.0  # mm per character (approximate)
        self.available_fonts = ["default", "block", "script", "serif"]
        self.current_font = "default"
        
    def convert_text_to_embroidery(self, request: TextEmbroideryRequest) -> List[EmbroideryFile]:
        """Convert text to embroidery files in the specified formats."""
        files = []
        
        for format_name in request.output_formats:
            try:
                content = self._generate_embroidery_content(request, format_name)
                filename = f"embroidery_{request.text[:20]}.{format_name.lower()}"
                
                files.append(EmbroideryFile(
                    format=format_name,
                    content=content,
                    filename=filename
                ))
            except Exception as e:
                print(f"Error generating {format_name} format: {e}")
                continue
                
        return files
    
    def _generate_embroidery_content(self, request: TextEmbroideryRequest, format_name: str) -> bytes:
        """Generate embroidery file content for a specific format."""
        
        # Calculate dimensions
        if request.shape == 'line':
            width = request.line_length or (len(request.text) * self.character_width)
            height = 20  # Fixed height for line text
        else:  # circle
            radius = request.circle_radius or 50
            width = height = radius * 2
        
        # Generate stitch coordinates
        stitches = self._generate_stitches(request.text, request.shape, width, height)
        
        # Convert to format-specific content
        if format_name.upper() == 'DST':
            return self._to_dst_format(stitches, width, height)
        elif format_name.upper() == 'PES':
            return self._to_pes_format(stitches, width, height)
        elif format_name.upper() == 'JEF':
            return self._to_jef_format(stitches, width, height)
        else:
            # For other formats, return a generic text representation
            return self._to_generic_format(stitches, format_name, request)
    
    def _generate_stitches(self, text: str, shape: str, width: float, height: float) -> List[Tuple[float, float]]:
        """Generate stitch coordinates for the text."""
        stitches = []
        
        if shape == 'line':
            stitches = self._generate_line_stitches(text, width, height)
        else:  # circle
            stitches = self._generate_circle_stitches(text, width, height)
            
        return stitches
    
    def _generate_line_stitches(self, text: str, width: float, height: float) -> List[Tuple[float, float]]:
        """Generate stitches for straight line text."""
        stitches = []
        char_width = width / len(text)
        
        for i, char in enumerate(text):
            char_x = i * char_width + char_width / 2
            char_y = height / 2
            
            # Generate stitches based on selected font
            char_stitches = self._generate_character_stitches(char, char_x, char_y, char_width, height)
            stitches.extend(char_stitches)
        
        return stitches
    
    def _generate_character_stitches(self, char: str, x: float, y: float, width: float, height: float) -> List[Tuple[float, float]]:
        """Generate stitches for a single character based on font."""
        stitches = []
        
        if self.current_font == "block":
            stitches = self._block_font_stitches(char, x, y, width, height)
        elif self.current_font == "script":
            stitches = self._script_font_stitches(char, x, y, width, height)
        elif self.current_font == "serif":
            stitches = self._serif_font_stitches(char, x, y, width, height)
        else:  # default
            stitches = self._default_font_stitches(char, x, y, width, height)
        
        return stitches
    
    def _block_font_stitches(self, char: str, x: float, y: float, width: float, height: float) -> List[Tuple[float, float]]:
        """Generate block-style font stitches."""
        stitches = []
        char_upper = char.upper()
        
        # Define block font patterns (simplified)
        if char_upper == "A":
            # A shape: triangle with crossbar
            stitches.extend([(x, y + height), (x + width/2, y), (x + width, y + height)])
            stitches.extend([(x + width*0.2, y + height*0.6), (x + width*0.8, y + height*0.6)])
        elif char_upper == "B":
            # B shape: vertical line with curves
            stitches.extend([(x, y), (x, y + height)])
            stitches.extend([(x, y), (x + width*0.7, y), (x + width, y + height*0.3)])
            stitches.extend([(x + width*0.7, y + height*0.3), (x, y + height*0.3)])
            stitches.extend([(x, y + height*0.3), (x + width*0.7, y + height*0.3), (x + width, y + height)])
        else:
            # Default: simple rectangle
            stitches.extend([(x, y), (x + width, y), (x + width, y + height), (x, y + height), (x, y)])
        
        return stitches
    
    def _script_font_stitches(self, char: str, x: float, y: float, width: float, height: float) -> List[Tuple[float, float]]:
        """Generate script-style font stitches."""
        stitches = []
        char_upper = char.upper()
        
        # Define script font patterns (curved, flowing)
        if char_upper == "A":
            # Curved A
            stitches.extend([(x, y + height), (x + width*0.3, y + height*0.3), (x + width*0.5, y)])
            stitches.extend([(x + width*0.5, y), (x + width*0.7, y + height*0.3), (x + width, y + height)])
            stitches.extend([(x + width*0.2, y + height*0.6), (x + width*0.8, y + height*0.6)])
        else:
            # Default: curved lines
            for i in range(5):
                t = i / 4.0
                curve_x = x + width * t
                curve_y = y + height * (0.5 + 0.3 * math.sin(t * math.pi))
                stitches.append((curve_x, curve_y))
        
        return stitches
    
    def _serif_font_stitches(self, char: str, x: float, y: float, width: float, height: float) -> List[Tuple[float, float]]:
        """Generate serif-style font stitches."""
        stitches = []
        char_upper = char.upper()
        
        # Define serif font patterns (with decorative ends)
        if char_upper == "A":
            # Serif A with decorative ends
            stitches.extend([(x, y + height), (x + width*0.5, y), (x + width, y + height)])
            # Add serifs
            stitches.extend([(x - width*0.1, y + height), (x, y + height), (x + width*0.1, y + height)])
            stitches.extend([(x + width*0.9, y + height), (x + width, y + height), (x + width + width*0.1, y + height)])
        else:
            # Default: simple with serifs
            stitches.extend([(x, y), (x + width, y), (x + width, y + height), (x, y + height), (x, y)])
            # Add serifs
            if char_upper in "ILT":
                # Vertical serifs
                stitches.extend([(x - width*0.1, y), (x, y), (x + width*0.1, y)])
                stitches.extend([(x - width*0.1, y + height), (x, y + height), (x + width*0.1, y + height)])
        
        return stitches
    
    def _default_font_stitches(self, char: str, x: float, y: float, width: float, height: float) -> List[Tuple[float, float]]:
        """Generate default font stitches (simple geometric)."""
        stitches = []
        
        # Simple geometric representation
        for j in range(10):  # 10 stitches per character
            stitch_x = x + (j - 5) * 0.5
            stitch_y = y + (j - 5) * 0.5
            if 0 <= stitch_x <= width and 0 <= stitch_y <= height:
                stitches.append((stitch_x, stitch_y))
        
        return stitches
    
    def _generate_circle_stitches(self, text: str, width: float, height: float) -> List[Tuple[float, float]]:
        """Generate stitches for circular text."""
        stitches = []
        radius = width / 2
        center_x = width / 2
        center_y = height / 2
        
        # Calculate angle per character
        angle_per_char = (2 * math.pi) / len(text)
        
        for i, char in enumerate(text):
            angle = i * angle_per_char
            
            # Position character on circle
            char_x = center_x + radius * math.cos(angle)
            char_y = center_y + radius * math.sin(angle)
            
            # Generate stitches around character position
            for j in range(8):  # 8 stitches per character
                stitch_angle = angle + (j - 4) * 0.1
                x = center_x + (radius - 5) * math.cos(stitch_angle)
                y = center_y + (radius - 5) * math.sin(stitch_angle)
                
                if 0 <= x <= width and 0 <= y <= height:
                    stitches.append((x, y))
        
        return stitches
    
    def _to_dst_format(self, stitches: List[Tuple[float, float]], width: float, height: float) -> bytes:
        """Convert stitches to DST format."""
        # DST format header (simplified)
        header = b'LA:EmbroideryForge\x00' + b'\x00' * 16
        
        # Convert coordinates to DST format
        dst_data = b''
        for x, y in stitches:
            # DST uses 3-byte coordinates
            x_bytes = int(x * 10).to_bytes(3, 'little', signed=True)
            y_bytes = int(y * 10).to_bytes(3, 'little', signed=True)
            dst_data += x_bytes + y_bytes
        
        return header + dst_data
    
    def _to_pes_format(self, stitches: List[Tuple[float, float]], width: float, height: float) -> bytes:
        """Convert stitches to PES format."""
        # PES format header (simplified)
        header = b'#PES0001' + b'\x00' * 8
        
        # Convert coordinates to PES format
        pes_data = b''
        for x, y in stitches:
            # PES uses 2-byte coordinates
            x_bytes = int(x).to_bytes(2, 'little', signed=True)
            y_bytes = int(y).to_bytes(2, 'little', signed=True)
            pes_data += x_bytes + y_bytes
        
        return header + pes_data
    
    def _to_jef_format(self, stitches: List[Tuple[float, float]], width: float, height: float) -> bytes:
        """Convert stitches to JEF format."""
        # JEF format header (simplified)
        header = b'JEF\x00' + b'\x00' * 12
        
        # Convert coordinates to JEF format
        jef_data = b''
        for x, y in stitches:
            # JEF uses 2-byte coordinates
            x_bytes = int(x).to_bytes(2, 'little', signed=True)
            y_bytes = int(y).to_bytes(2, 'little', signed=True)
            jef_data += x_bytes + y_bytes
        
        return header + jef_data
    
    def _to_generic_format(self, stitches: List[Tuple[float, float]], format_name: str, request: TextEmbroideryRequest) -> bytes:
        """Convert stitches to a generic text format."""
        content = f"# Embroidery File Generated by EmbroideryForge\n"
        content += f"# Format: {format_name}\n"
        content += f"# Text: {request.text}\n"
        content += f"# Shape: {request.shape}\n"
        content += f"# Units: {request.units}\n"
        content += f"# Stitches: {len(stitches)}\n\n"
        
        for i, (x, y) in enumerate(stitches):
            content += f"{i+1:4d}: {x:8.2f}, {y:8.2f}\n"
        
        return content.encode('utf-8')
    
    def set_font(self, font_name: str) -> bool:
        """Set the current font for text generation."""
        if font_name in self.available_fonts:
            self.current_font = font_name
            return True
        return False
    
    def get_available_fonts(self) -> List[str]:
        """Get list of available fonts."""
        return self.available_fonts.copy()
    
    def get_current_font(self) -> str:
        """Get the currently selected font."""
        return self.current_font

def main():
    """Test the text to embroidery converter."""
    converter = TextEmbroideryConverter()
    
    print("🧵 Testing Text to Embroidery Converter with Fonts")
    print("=" * 60)
    
    # Test different fonts
    test_fonts = ["default", "block", "script", "serif"]

    # Create output directory if not exists
    os.makedirs("output", exist_ok=True)
    os.chdir("output")
            
    # Create a subdirectory for each worker run check if directory exists run_1, run_2, etc.
    run_dir = "run_1"
    i = 1
    while os.path.exists(run_dir):
        i += 1
        run_dir = f"run_{i}"
    os.makedirs(run_dir)
    os.chdir(run_dir)
    

    print(f"   (Saved in directory: {os.path.abspath(run_dir)})")
    
    for font in test_fonts:
        print(f"\n📝 Testing Font: {font.upper()}")
        print("-" * 40)
        
        # Set font
        converter.set_font(font)
        
        # Test request
        request = TextEmbroideryRequest(
            text="HELLO",
            shape="line",
            units="mm",
            line_length=100,
            output_formats=["PES"]
        )
        
        try:
            files = converter.convert_text_to_embroidery(request)
            print(f"✅ Successfully generated {len(files)} embroidery files:")

            for file in files:
                # Save to disk for verification (optional)
                with open(file.filename, 'wb') as f:
                    f.write(file.content)
                
                # Print file info
                print(f"  - {file.filename} ({len(file.content)} bytes)")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("🎯 Font testing completed!")

if __name__ == "__main__":
    main()
